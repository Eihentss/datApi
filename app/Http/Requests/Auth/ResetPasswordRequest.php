<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class ResetPasswordRequest extends FormRequest
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
            'token' => ['required', 'string'],
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'token.required' => 'Atiestatīšanas žetona ir obligāts.',
            'email.required' => 'E-pasta adrese ir obligāta.',
            'email.email' => 'E-pasta adrese jābūt derīgai e-pasta adresei.',
            'email.exists' => 'Šī e-pasta adrese nav atrasta mūsu sistēmā.',
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
            'email' => 'E-pasta adrese',
            'password' => 'Parole',
            'password_confirmation' => 'Paroles apstiprinājums',
        ];
    }
}
