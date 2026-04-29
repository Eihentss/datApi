<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreImageResourceRequest extends FormRequest
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
            'image' => ['required', 'image', 'max:2048'],
            'folder_name' => ['required', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Attēls ir obligāts.',
            'image.image' => 'Fails jābūt attēlam (jpeg, png, bmp, gif, svg vai webp).',
            'image.max' => 'Attēls nedrīkst būt lielāks par 2 MB.',
            'folder_name.required' => 'Mapes nosaukums ir obligāts.',
            'folder_name.string' => 'Mapes nosaukumam jābūt tekstam.',
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'image' => 'Attēls',
            'folder_name' => 'Mapes nosaukums',
        ];
    }
}
