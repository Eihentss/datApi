<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Vārds ir obligāts.',
            'name.string' => 'Vārdam jābūt tekstam.',
            'name.max' => 'Vārds nedrīkst pārsniegt 255 rakstzīmes.',
            'email.required' => 'E-pasta adrese ir obligāta.',
            'email.email' => 'E-pasta adrese jābūt derīgai e-pasta adresei.',
            'email.unique' => 'Šī e-pasta adrese jau ir izmantota.',
            'email.max' => 'E-pasta adrese nedrīkst pārsniegt 255 rakstzīmes.',
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'name' => 'Vārds',
            'email' => 'E-pasta adrese',
        ];
    }
}
