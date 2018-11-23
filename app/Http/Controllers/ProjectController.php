<?php

namespace App\Http\Controllers;

use App\Project;
use App\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Spark\Spark;
use Laravel\Spark\Contracts\Repositories\TeamRepository;

class ProjectController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');

        // $this->middleware('subscribed');
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function all(Request $request, $teamId)
    {
        $team = Spark::interact(TeamRepository::class.'@find', [$teamId]);

        $projects = $team->projects()->get();

        abort_unless($request->user()->onTeam($team), 404);

//        if ($request->user()->ownsTeam($team)) {
//            $team->load('subscriptions');
//
//            $team->shouldHaveOwnerVisibility();
//        }

        return $projects;
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function individual($project_slug)
    {
        $team = Auth::user()->currentTeam;

        $project = $team->projects()->where('slug', '=' , $project_slug)->firstOrFail();

        return view('project_view', ['project' => $project]);
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function resources($project_slug)
    {
        $team = Auth::user()->currentTeam;

        $project = $team->projects()->where('slug', '=' , $project_slug)->firstOrFail();

        $resources = $project->resources()->get();

        return view('resources', ['resources' => $resources, 'project' => $project]);
    }

    /**
     * @param Request $request
     */
    public function store(Request $request)
    {
        $project = new Project();

        $project->name = $request->name;
        $project->slug = $request->slug;
        $project->platform = $request->platform;
        $project->team_id = $request->team_id;

        $project->save();

        return;
    }

    /**
     * @param Request $request
     */
    public function updateDiagram(Request $request, $team, $project)
    {
        abort_unless($request->user()->onTeam($team), 404);
        $project = Project::find($project);
        $project->diagram = $request->diagram;
        $project->save();

        return;
    }

    /**
     * @param Request $request
     */
    public function getDiagram(Request $request, $team, $project)
    {
        abort_unless($request->user()->onTeam($team), 404);
        $project = Project::find($project);

        return $project->diagram;
    }

    /**
     * @param Request $request
     * @param $project
     */
    public function destroy(Request $request, $team, $project)
    {
        if (! $request->user()->ownsTeam($team)) {
            abort(404);
        }

        $deleteable = Project::find($project);
        $deleteable->delete();

        return;
    }

    /**
     * Show the application dashboard.
     *
     * @return Response
     */
    public function design(Request $request, $team, $project)
    {
        abort_unless($request->user()->onTeam($team), 404);

        $project = $team->projects()->find($project);

        return view('layouts.design', ['team' => $team->id, 'platform' => $project->platform, 'project' => $project->id]);
    }

    public function createTest()
    {
        $project = new Project();

        $project->name = 'Test Project 8';
        $project->slug = 'test8';
        $project->platform = 'aws';
        $project->team_id = 6;

        $project->save();

        return 'Project Created';
    }

    public function resourceCreate()
    {
        $resource = new Resource();

        $resource->name = 'Test Resource 2';
        $resource->type = 'aws_ec2_instance';
        $resource->resource_arn = 'arn:1234aeqwd';
        $resource->project_id = 2;

        $resource->save();

        return 'Resource Created';
    }
}
