<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddUserToApiRequest extends FormRequest
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
            'email' => ['required', 'email'],
            'role' => ['required', 'in:admin,co-owner'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'E-pasta adrese ir obligāta.',
            'email.email' => 'E-pasta adrese jābūt derīgai e-pasta adresei.',
            'role.required' => 'Loma ir obligāta.',
            'role.in' => 'Lomai jābūt admin vai co-owner.',
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'email' => 'E-pasta adrese',
            'role' => 'Loma',
        ];
    }
}
