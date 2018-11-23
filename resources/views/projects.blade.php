<projects :user="user" :team="team" inline-template>
    <div>
        <!-- Create Team -->
        @if (Spark::createsAdditionalTeams())
            @include('create-project')
        @endif

    <!-- Current Teams -->
        <div v-if="user && projects.length > 0">
            @include('team-projects')
        </div>
    </div>
</projects>