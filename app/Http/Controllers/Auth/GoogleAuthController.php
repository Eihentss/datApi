<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user already exists with this email
            $existingUser = User::where('email', $googleUser->email)->first();
            
            if ($existingUser) {
                // User exists - log them in
                if (!$existingUser->google_id) {
                    // Update existing user with Google ID if they don't have one
                    $existingUser->update([
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                    ]);
                }
                
                Auth::login($existingUser, true);
                
                return redirect()->intended(route('Create', absolute: false));
            }
            
            // User doesn't exist - create new user
            $newUser = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'avatar' => $googleUser->avatar,
                'email_verified_at' => now(), // Google emails are already verified
                'password' => Hash::make(Str::random(32)), // Random password since they use Google
                'isgoogle' => true,
            ]);
            
            event(new Registered($newUser));
            Auth::login($newUser, true);
            
            return redirect()->intended(route('Create', absolute: false));
            
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Kļūda pieslēdzoties ar Google. Lūdzu, mēģiniet vēlreiz.');
        }
    }
    
    /**
     * Handle user logout and revoke Google token if needed
     */
    public function logout(): RedirectResponse
    {
        Auth::logout();
        return redirect()->route('login');
    }
}