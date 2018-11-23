<?php

namespace App;

use Laravel\Spark\Team as SparkTeam;

class Team extends SparkTeam
{
    /**
     * Get all of the projects that belong to the team.
     */
    public function projects()
    {
        return $this->hasMany('App\Project');
    }
}
