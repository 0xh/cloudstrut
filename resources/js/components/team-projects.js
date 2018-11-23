Vue.component('team-projects', {
    props: ['user', 'team'],

    /**
     * The component's data.
     */
    data() {
        return {
            projects: [],
            deletingProject: null,
            deleteProjectForm: new SparkForm({})
        };
    },

    /**
     * The component has been created by Vue.
     */
    created() {
        let self = this;
        this.getProjects();

        Bus.$on('updateProjects', function () {
            self.getProjects();
        });
    },

    methods: {
        /**
         * Get the team being managed.
         */
        getProjects() {
            axios.get(`/settings/${Spark.teamsPrefix}/json/${this.team.id}/projects`)
                .then(response => {
                    this.projects = response.data;
                });
        },

        /**
         * Approve the deletion of the given team.
         */
        approveProjectDelete(project) {
            this.deletingProject = project;

            $('#modal-delete-project').modal('show');
        },


        /**
         * Delete the given team.
         */
        deleteProject() {
            Spark.delete(`/settings/${Spark.teamsPrefix}/${this.deletingProject.team_id}/projects/${this.deletingProject.id}`, this.deleteProjectForm)
                .then(() => {
                    Bus.$emit('updateUser');
                    Bus.$emit('updateProjects');

                    $('#modal-delete-project').modal('hide');
                });
        }
    }
});