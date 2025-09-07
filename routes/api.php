<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DynamicApiController;


Route::match(['get', 'post', 'put', 'delete'], '{slug}', [DynamicApiController::class, 'handle']);
