<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
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
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'current_password.required' => 'Pašreizējā parole ir obligāta.',
            'current_password.current_password' => 'Pašreizējā parole ir nepareiza.',
            'password.required' => 'Jaunā parole ir obligāta.',
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
            'current_password' => 'Pašreizējā parole',
            'password' => 'Jaunā parole',
            'password_confirmation' => 'Jaunās paroles apstiprinājums',
        ];
    }
}
