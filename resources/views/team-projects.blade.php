<team-projects :user="user" :team="team" inline-template>
    <div>
    <!-- Team Projects -->
        <div v-if="user && team">
            <div>
                <div class="card card-default">
                    <div class="card-header">
                        Projects
                    </div>

                    <div class="table-responsive">
                        <table class="table table-valign-middle mb-0">
                            <thead>
                                <th>{{__('Name')}}</th>
                                <th>Platform</th>
                                <th> </th>
                            </thead>

                            <tbody>
                            <tr v-for="project in projects">
                                <!-- Name -->
                                <td>
                                <span>
                                    @{{ project.name }}
                                </span>
                                </td>

                                <!-- Actions -->
                                <td>
                                    @{{ project.platform }}
                                </td>
                                <td class="td-fit">
                                    <a :href="'/settings/{{Spark::teamsPrefix()}}/'+team.id+'/projects/'+project.id+'/design'">
                                        <button class="btn btn-outline-warning">
                                            <i class="fa fa-pencil"></i>
                                        </button>
                                    </a>

                                    <a :href="'/settings/{{Spark::teamsPrefix()}}/'+team.id+'/projects/'+project.id">
                                        <button class="btn btn-outline-primary">
                                            <i class="fa fa-cog"></i>
                                        </button>
                                    </a>

                                    @if (Spark::createsAdditionalTeams())
                                        <button class="btn btn-outline-danger" @click="approveProjectDelete(project)" v-if="user.id === team.owner_id">
                                            <i class="fa fa-times"></i>
                                        </button>
                                    @endif
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Delete Team Modal -->
                <div class="modal" id="modal-delete-project" tabindex="-1" role="dialog">
                    <div class="modal-dialog" v-if="deletingProject">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">
                                    {{__('teams.delete_team')}}
                                </h5>
                            </div>

                            <div class="modal-body">
                                Are you sure you want to delete this project?
                                All data will be permanently erased
                            </div>

                            <!-- Modal Actions -->
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">{{__('No, Go Back')}}</button>

                                <button type="button" class="btn btn-danger" @click="deleteProject" :disabled="deleteProjectForm.busy">
                            <span v-if="deleteProjectForm.busy">
                                <i class="fa fa-btn fa-spinner fa-spin"></i> {{__('Deleting')}}
                            </span>

                                    <span v-else>
                                {{__('Yes, Delete')}}
                            </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</team-projects>
