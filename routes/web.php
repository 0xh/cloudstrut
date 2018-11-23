<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Auth routing
Route::get('email/verify', 'Auth\VerificationController@show')->name('verification.notice');
Route::get('email/verify/{id}', 'Auth\VerificationController@verify')->name('verification.verify');
Route::get('email/resend', 'Auth\VerificationController@resend')->name('verification.resend');

// App routing
Route::get('/', 'WelcomeController@show');
Route::get('/home', 'HomeController@show');
Route::get('/settings/'.Spark::teamsPrefix().'/json/{team_id}/projects', 'ProjectController@all');
Route::post('/settings/'.Spark::teamsPrefix().'/projects', 'ProjectController@store');
Route::post('/settings/'.Spark::teamsPrefix().'/{team}/projects/{project}/updatediagram', 'ProjectController@updateDiagram');
Route::get('/settings/'.Spark::teamsPrefix().'/{team}/projects/{project}/getdiagram', 'ProjectController@getDiagram');
Route::delete('/settings/'.Spark::teamsPrefix().'/{team}/projects/{project}', 'ProjectController@destroy');
Route::get('/settings/'.Spark::teamsPrefix().'/{team}/projects/{project}/design', 'ProjectController@design');