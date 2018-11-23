<create-project :user="user" :team="team" inline-template>
    <div class="card card-default">
        <div class="card-header">Create Project</div>

        <div class="card-body">
            <form role="form" v-if="canCreateMoreTeams">
                <!-- Name -->
                <div class="form-group row">
                    <label class="col-md-4 col-form-label text-md-right">Project Name</label>

                    <div class="col-md-6">
                        <input type="text" id="create-team-name" class="form-control" name="name" v-model="form.name" :class="{'is-invalid': form.errors.has('name')}">

                        <span class="invalid-feedback" v-if="hasTeamLimit">
                            <?php echo __('teams.you_have_x_teams_remaining', ['teamCount' => '{{ remainingTeams }}']); ?>
                        </span>

                        <span class="invalid-feedback" v-show="form.errors.has('name')">
                            @{{ form.errors.get('name') }}
                        </span>
                    </div>
                </div>

                <!-- Platform -->
                <div class="form-group row">
                    <label class="col-md-4 col-form-label text-md-right">Platform</label>

                    <div class="col-md-6">
                        <select id="create-team-platform" class="form-control" name="platform" v-model="form.platform" :class="{'is-invalid': form.errors.has('platform')}">
                            <option value="aws">AWS</option>
                            <option value="azure">Azure</option>
                            <option value="gcp">Google Gloud Platform</option>
                        </select>

                        <span class="invalid-feedback" v-show="form.errors.has('platform')">
                            @{{ form.errors.get('platform') }}
                        </span>
                    </div>
                </div>

            <!-- Create Button -->
                <div class="form-group row mb-0">
                    <div class="offset-md-4 col-md-6">
                        <button type="submit" class="btn btn-primary"
                                @click.prevent="create"
                                :disabled="form.busy">

                            {{__('Create')}}
                        </button>
                    </div>
                </div>
            </form>

            <div v-else>
                <span class="text-danger">
                    {{__('teams.plan_allows_no_more_teams')}},
                    <a href="{{ url('/settings#/subscription') }}">{{__('please upgrade your subscription')}}</a>.
                </span>
            </div>
        </div>
    </div>
</create-project>
