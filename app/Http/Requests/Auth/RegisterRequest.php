<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Pilnais vārds ir obligāts.',
            'name.string' => 'Pilnais vārds jābūt tekstam.',
            'name.max' => 'Pilnais vārds nedrīkst pārsniegt 255 rakstzīmes.',
            'email.required' => 'E-pasta adrese ir obligāta.',
            'email.email' => 'E-pasta adrese jābūt derīgai e-pasta adresei.',
            'email.unique' => 'Šī e-pasta adrese jau ir reģistrēta.',
            'email.max' => 'E-pasta adrese nedrīkst pārsniegt 255 rakstzīmes.',
            'password.required' => 'Parole ir obligāta.',
            'password.confirmed' => 'Paroles apstiprinājums nesakrīt.',
            'password.min' => 'Parolei jābūt vismaz 8 rakstzīmēm.',
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'name' => 'Pilnais vārds',
            'email' => 'E-pasta adrese',
            'password' => 'Parole',
            'password_confirmation' => 'Paroles apstiprinājums',
        ];
    }
}
