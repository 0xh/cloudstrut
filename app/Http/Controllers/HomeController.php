<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Aws\S3\S3Client;
use Aws\Common\Credentials\Credentials;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth.real');
        $this->middleware('verified');
        $this->middleware('subscribed');
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function show()
    {
        $access_key = 'blargon';
        $access_secret = 'secret_blargon';
        $credentials = new Credentials($access_key, $access_secret);
        $s3Client = S3Client::factory(array(
            'credentials' => $credentials
        ));

        return view('home');
    }
}
