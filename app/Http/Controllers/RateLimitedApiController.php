<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\RateLimiter;

abstract class RateLimitedApiController extends BaseApiController
{
    protected $request;
    protected $resource;

    protected function throttleKey(): string
    {
        return 'api:' . $this->resource->id . ':' . ($this->request->user()?->id ?: $this->request->ip());
    }

    protected function checkRateLimit(int $maxAttempts = 5, int $decaySeconds = 60)
    {
        if (RateLimiter::tooManyAttempts($this->throttleKey(), $maxAttempts)) {
            return [
                'blocked' => true,
                'retry_after' => RateLimiter::availableIn($this->throttleKey())
            ];
        }

        RateLimiter::hit($this->throttleKey(), $decaySeconds);
        return ['blocked' => false];
    }
}
