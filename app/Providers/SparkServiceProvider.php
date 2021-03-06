<?php

namespace App\Providers;

use Laravel\Spark\Spark;
use Laravel\Spark\Providers\AppServiceProvider as ServiceProvider;

class SparkServiceProvider extends ServiceProvider
{
    /**
     * Your application and company details.
     *
     * @var array
     */
    protected $details = [
        'vendor' => 'Cloudstrut Limited',
        'product' => 'Cloudstrut',
        'street' => 'PO Box 111',
        'location' => 'Your Town, NY 12345',
        'phone' => '555-555-5555',
    ];

    /**
     * The address where customer support e-mails should be sent.
     *
     * @var string
     */
    protected $sendSupportEmailsTo = "adam.thomason@cloudstrut.com";

    /**
     * All of the application developer e-mail addresses.
     *
     * @var array
     */
    protected $developers = [
        "adam.thomason@cloudstrut.com"
    ];

    /**
     * Indicates if the application will expose an API.
     *
     * @var bool
     */
    protected $usesApi = true;

    /**
     * Finish configuring Spark for the application.
     *
     * @return void
     */
    public function booted()
    {
        Spark::useStripe()->noCardUpFront()->teamTrialDays(7);
        Spark::useTwoFactorAuth();
        Spark::collectEuropeanVat('GB');

        Spark::useRoles([
            "readonly" => "Read Only",
            "developer" => "Developer",
            "admin" => "Admin",
        ]);

        Spark::chargeTeamsPerMember();

        Spark::teamPlan('Regular', 'plan_E2WBVQB6E8YMna')
            ->price(7)
            ->features([
                'First', 'Second', 'Third'
            ]);
    }
}
