<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApiResourceRequest extends FormRequest
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
            'route' => [
                'required',
                'string',
                'max:255',
                'regex:/^\/[a-zA-Z0-9_\-]+$/',
                'not_in:/api',
                Rule::unique('api_resources', 'route')->ignore($this->route('apiResource')->id),
            ],
            'format' => ['required', 'in:json,xml,yaml'],
            'visibility' => ['required', 'in:public,private'],
            'password' => ['nullable', 'string', 'min:4'],
            'allow_get' => ['boolean'],
            'allow_post' => ['boolean'],
            'allow_put' => ['boolean'],
            'allow_delete' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'route.required' => 'Maršruts ir obligāts.',
            'route.string' => 'Maršrutam jābūt tekstam.',
            'route.max' => 'Maršruts nedrīkst pārsniegt 255 rakstzīmes.',
            'route.regex' => 'Maršrutam jāsākas ar / un jāsatur tikai burtus, ciparus, - vai _.',
            'route.not_in' => 'Maršruts nevar sākties ar /api (tas ir rezervēts sistēmai).',
            'route.unique' => 'Šāds maršruts jau eksistē.',
            'format.required' => 'Formāts ir obligāts.',
            'format.in' => 'Formātam jābūt json, xml vai yaml.',
            'visibility.required' => 'Redzamība ir obligāta.',
            'visibility.in' => 'Redzamībai jābūt publiskai vai privātai.',
            'password.string' => 'Parolei jābūt tekstam.',
            'password.min' => 'Parolei jābūt vismaz 4 rakstzīmes gara.',
            'allow_get.boolean' => 'allow_get jābūt booleska vērtībai.',
            'allow_post.boolean' => 'allow_post jābūt booleska vērtībai.',
            'allow_put.boolean' => 'allow_put jābūt booleska vērtībai.',
            'allow_delete.boolean' => 'allow_delete jābūt booleska vērtībai.',
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'route' => 'Maršruts',
            'format' => 'Formāts',
            'visibility' => 'Redzamība',
            'password' => 'Parole',
            'allow_get' => 'Atļaut GET',
            'allow_post' => 'Atļaut POST',
            'allow_put' => 'Atļaut PUT',
            'allow_delete' => 'Atļaut DELETE',
        ];
    }
}
