Vue.component('projects', {
    props: ['user', 'team'],

    /**
     * The component's data.
     */
    data() {
        return {
            projects: [],
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
        }
    }
});