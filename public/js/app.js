/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/app.js":
/***/ (function(module, exports, __webpack_require__) {


/*
 |--------------------------------------------------------------------------
 | Laravel Spark Bootstrap
 |--------------------------------------------------------------------------
 |
 | First, we will load all of the "core" dependencies for Spark which are
 | libraries such as Vue and jQuery. This also loads the Spark helpers
 | for things such as HTTP calls, forms, and form validation errors.
 |
 | Next, we'll create the root Vue application for Spark. This will start
 | the entire application and attach it to the DOM. Of course, you may
 | customize this script as you desire and load your own components.
 |
 */

__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"spark-bootstrap\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
__webpack_require__("./resources/js/components/bootstrap.js");
__webpack_require__("./resources/js/components/projects.js");
__webpack_require__("./resources/js/components/create-project.js");
__webpack_require__("./resources/js/components/team-projects.js");

var app = new Vue({
  mixins: [__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"spark\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))]
});

/***/ }),

/***/ "./resources/js/components/bootstrap.js":
/***/ (function(module, exports, __webpack_require__) {


/*
 |--------------------------------------------------------------------------
 | Laravel Spark Components
 |--------------------------------------------------------------------------
 |
 | Here we will load the Spark components which makes up the core client
 | application. This is also a convenient spot for you to load all of
 | your components that you write while building your applications.
 */

__webpack_require__("./resources/js/spark-components/bootstrap.js");

__webpack_require__("./resources/js/components/home.js");

/***/ }),

/***/ "./resources/js/components/create-project.js":
/***/ (function(module, exports) {

Vue.component('create-project', {
    props: ['user', 'team'],
    /**
     * The component's data.
     */
    data: function data() {
        return {
            plans: [],

            form: new SparkForm({
                name: '',
                platform: '',
                slug: '',
                team_id: ''
            })
        };
    },

    computed: {
        /**
         * Get the active subscription instance.
         */
        activeSubscription: function activeSubscription() {
            if (!this.$parent.billable) {
                return;
            }

            var subscription = _.find(this.$parent.billable.subscriptions, function (subscription) {
                return subscription.name == 'default';
            });

            if (typeof subscription !== 'undefined') {
                return subscription;
            }
        },

        /**
         * Get the active plan instance.
         */
        activePlan: function activePlan() {
            var _this = this;

            if (this.activeSubscription) {
                return _.find(this.plans, function (plan) {
                    return plan.id == _this.activeSubscription.provider_plan;
                });
            }
        },

        /**
         * Check if there's a limit for the number of teams.
         */
        hasTeamLimit: function hasTeamLimit() {
            if (!this.activePlan) {
                return false;
            }

            return !!this.activePlan.attributes.teams;
        },

        /**
         *
         * Get the remaining teams in the active plan.
         */
        remainingTeams: function remainingTeams() {
            var ownedTeams = _.filter(this.$parent.teams, { owner_id: this.$parent.billable.id });

            return this.activePlan ? this.activePlan.attributes.teams - ownedTeams.length : 0;
        },

        /**
         * Check if the user can create more teams.
         */
        canCreateMoreTeams: function canCreateMoreTeams() {
            if (!this.hasTeamLimit) {
                return true;
            }

            return this.remainingTeams > 0;
        }
    },

    /**
     * The component has been created by Vue.
     */
    created: function created() {
        this.getPlans();
    },

    watch: {
        /**
         * Watch the team name for changes.
         */
        'form.name': function formName(val, oldVal) {
            if (this.form.slug == '' || this.form.slug == oldVal.toLowerCase().replace(/[\s\W-]+/g, '-')) {
                this.form.slug = val.toLowerCase().replace(/[\s\W-]+/g, '-');
            }
        }
    },

    methods: {
        /**
         * Create a new project.
         */
        create: function create() {
            var _this2 = this;

            this.form.team_id = this.team.id;
            Spark.post('/settings/' + Spark.teamsPrefix + '/projects', this.form).then(function () {
                _this2.form.name = '';
                _this2.form.platform = '';
                _this2.form.team_id = '';
                _this2.form.slug = '';

                Bus.$emit('updateUser');
                Bus.$emit('updateProjects');
            });
        },

        /**
         * Get all the plans defined in the application.
         */
        getPlans: function getPlans() {
            var _this3 = this;

            axios.get('/spark/plans').then(function (response) {
                _this3.plans = response.data;
            });
        }
    }
});

/***/ }),

/***/ "./resources/js/components/home.js":
/***/ (function(module, exports) {

Vue.component('home', {
    props: ['user'],

    mounted: function mounted() {
        //
    }
});

/***/ }),

/***/ "./resources/js/components/projects.js":
/***/ (function(module, exports) {

Vue.component('projects', {
    props: ['user', 'team'],

    /**
     * The component's data.
     */
    data: function data() {
        return {
            projects: []
        };
    },

    /**
     * The component has been created by Vue.
     */
    created: function created() {
        var self = this;
        this.getProjects();

        Bus.$on('updateProjects', function () {
            self.getProjects();
        });
    },

    methods: {
        /**
         * Get the team being managed.
         */
        getProjects: function getProjects() {
            var _this = this;

            axios.get('/settings/' + Spark.teamsPrefix + '/json/' + this.team.id + '/projects').then(function (response) {
                _this.projects = response.data;
            });
        }
    }
});

/***/ }),

/***/ "./resources/js/components/team-projects.js":
/***/ (function(module, exports) {

Vue.component('team-projects', {
    props: ['user', 'team'],

    /**
     * The component's data.
     */
    data: function data() {
        return {
            projects: [],
            deletingProject: null,
            deleteProjectForm: new SparkForm({})
        };
    },

    /**
     * The component has been created by Vue.
     */
    created: function created() {
        var self = this;
        this.getProjects();

        Bus.$on('updateProjects', function () {
            self.getProjects();
        });
    },

    methods: {
        /**
         * Get the team being managed.
         */
        getProjects: function getProjects() {
            var _this = this;

            axios.get('/settings/' + Spark.teamsPrefix + '/json/' + this.team.id + '/projects').then(function (response) {
                _this.projects = response.data;
            });
        },

        /**
         * Approve the deletion of the given team.
         */
        approveProjectDelete: function approveProjectDelete(project) {
            this.deletingProject = project;

            $('#modal-delete-project').modal('show');
        },

        /**
         * Delete the given team.
         */
        deleteProject: function deleteProject() {
            Spark.delete('/settings/' + Spark.teamsPrefix + '/' + this.deletingProject.team_id + '/projects/' + this.deletingProject.id, this.deleteProjectForm).then(function () {
                Bus.$emit('updateUser');
                Bus.$emit('updateProjects');

                $('#modal-delete-project').modal('hide');
            });
        }
    }
});

/***/ }),

/***/ "./resources/js/spark-components/auth/register-braintree.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"auth/register-braintree\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-register-braintree', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/auth/register-stripe.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"auth/register-stripe\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-register-stripe', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/bootstrap.js":
/***/ (function(module, exports, __webpack_require__) {


/**
 * Layout Components...
 */
__webpack_require__("./resources/js/spark-components/navbar/navbar.js");
__webpack_require__("./resources/js/spark-components/notifications/notifications.js");

/**
 * Authentication Components...
 */
__webpack_require__("./resources/js/spark-components/auth/register-stripe.js");
__webpack_require__("./resources/js/spark-components/auth/register-braintree.js");

/**
 * Settings Component...
 */
__webpack_require__("./resources/js/spark-components/settings/settings.js");

/**
 * Profile Settings Components...
 */
__webpack_require__("./resources/js/spark-components/settings/profile.js");
__webpack_require__("./resources/js/spark-components/settings/profile/update-profile-photo.js");
__webpack_require__("./resources/js/spark-components/settings/profile/update-contact-information.js");

/**
 * Teams Settings Components...
 */
__webpack_require__("./resources/js/spark-components/settings/teams.js");
__webpack_require__("./resources/js/spark-components/settings/teams/create-team.js");
__webpack_require__("./resources/js/spark-components/settings/teams/pending-invitations.js");
__webpack_require__("./resources/js/spark-components/settings/teams/current-teams.js");
__webpack_require__("./resources/js/spark-components/settings/teams/team-settings.js");
__webpack_require__("./resources/js/spark-components/settings/teams/team-profile.js");
__webpack_require__("./resources/js/spark-components/settings/teams/update-team-photo.js");
__webpack_require__("./resources/js/spark-components/settings/teams/update-team-name.js");
__webpack_require__("./resources/js/spark-components/settings/teams/team-membership.js");
__webpack_require__("./resources/js/spark-components/settings/teams/send-invitation.js");
__webpack_require__("./resources/js/spark-components/settings/teams/mailed-invitations.js");
__webpack_require__("./resources/js/spark-components/settings/teams/team-members.js");

/**
 * Security Settings Components...
 */
__webpack_require__("./resources/js/spark-components/settings/security.js");
__webpack_require__("./resources/js/spark-components/settings/security/update-password.js");
__webpack_require__("./resources/js/spark-components/settings/security/enable-two-factor-auth.js");
__webpack_require__("./resources/js/spark-components/settings/security/disable-two-factor-auth.js");

/**
 * API Settings Components...
 */
__webpack_require__("./resources/js/spark-components/settings/api.js");
__webpack_require__("./resources/js/spark-components/settings/api/create-token.js");
__webpack_require__("./resources/js/spark-components/settings/api/tokens.js");

/**
 * Subscription Settings Components...
 */
__webpack_require__("./resources/js/spark-components/settings/subscription.js");
__webpack_require__("./resources/js/spark-components/settings/subscription/subscribe-stripe.js");
__webpack_require__("./resources/js/spark-components/settings/subscription/subscribe-braintree.js");
__webpack_require__("./resources/js/spark-components/settings/subscription/update-subscription.js");
__webpack_require__("./resources/js/spark-components/settings/subscription/resume-subscription.js");
__webpack_require__("./resources/js/spark-components/settings/subscription/cancel-subscription.js");

/**
 * Payment Method Components...
 */
__webpack_require__("./resources/js/spark-components/settings/payment-method-stripe.js");
__webpack_require__("./resources/js/spark-components/settings/payment-method-braintree.js");
__webpack_require__("./resources/js/spark-components/settings/payment-method/update-vat-id.js");
__webpack_require__("./resources/js/spark-components/settings/payment-method/update-payment-method-stripe.js");
__webpack_require__("./resources/js/spark-components/settings/payment-method/update-payment-method-braintree.js");
__webpack_require__("./resources/js/spark-components/settings/payment-method/redeem-coupon.js");

/**
 * Billing History Components...
 */
__webpack_require__("./resources/js/spark-components/settings/invoices.js");
__webpack_require__("./resources/js/spark-components/settings/invoices/update-extra-billing-information.js");
__webpack_require__("./resources/js/spark-components/settings/invoices/invoice-list.js");

/**
 * Kiosk Components...
 */
__webpack_require__("./resources/js/spark-components/kiosk/kiosk.js");
__webpack_require__("./resources/js/spark-components/kiosk/announcements.js");
__webpack_require__("./resources/js/spark-components/kiosk/metrics.js");
__webpack_require__("./resources/js/spark-components/kiosk/users.js");
__webpack_require__("./resources/js/spark-components/kiosk/profile.js");
__webpack_require__("./resources/js/spark-components/kiosk/add-discount.js");

/***/ }),

/***/ "./resources/js/spark-components/kiosk/add-discount.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"kiosk/add-discount\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-kiosk-add-discount', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/kiosk/announcements.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"kiosk/announcements\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-kiosk-announcements', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/kiosk/kiosk.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"kiosk/kiosk\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-kiosk', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/kiosk/metrics.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"kiosk/metrics\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-kiosk-metrics', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/kiosk/profile.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"kiosk/profile\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-kiosk-profile', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/kiosk/users.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"kiosk/users\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-kiosk-users', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/navbar/navbar.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"navbar/navbar\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-navbar', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/notifications/notifications.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"notifications/notifications\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-notifications', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/api.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/api\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-api', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/api/create-token.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/api/create-token\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-create-token', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/api/tokens.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/api/tokens\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-tokens', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/invoices.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/invoices\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-invoices', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/invoices/invoice-list.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/invoices/invoice-list\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-invoice-list', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/invoices/update-extra-billing-information.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/invoices/update-extra-billing-information\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-extra-billing-information', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/payment-method-braintree.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/payment-method-braintree\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-payment-method-braintree', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/payment-method-stripe.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/payment-method-stripe\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-payment-method-stripe', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/payment-method/redeem-coupon.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/payment-method/redeem-coupon\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-redeem-coupon', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/payment-method/update-payment-method-braintree.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/payment-method/update-payment-method-braintree\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-payment-method-braintree', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/payment-method/update-payment-method-stripe.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/payment-method/update-payment-method-stripe\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-payment-method-stripe', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/payment-method/update-vat-id.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/payment-method/update-vat-id\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-vat-id', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/profile.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/profile\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-profile', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/profile/update-contact-information.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/profile/update-contact-information\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-contact-information', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/profile/update-profile-photo.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/profile/update-profile-photo\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-profile-photo', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/security.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/security\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-security', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/security/disable-two-factor-auth.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/security/disable-two-factor-auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-disable-two-factor-auth', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/security/enable-two-factor-auth.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/security/enable-two-factor-auth\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-enable-two-factor-auth', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/security/update-password.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/security/update-password\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-password', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/settings.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/settings\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-settings', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/subscription.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/subscription\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-subscription', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/subscription/cancel-subscription.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/subscription/cancel-subscription\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-cancel-subscription', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/subscription/resume-subscription.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/subscription/resume-subscription\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-resume-subscription', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/subscription/subscribe-braintree.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/subscription/subscribe-braintree\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-subscribe-braintree', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/subscription/subscribe-stripe.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/subscription/subscribe-stripe\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-subscribe-stripe', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/subscription/update-subscription.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/subscription/update-subscription\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-subscription', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-teams', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/create-team.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/create-team\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-create-team', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/current-teams.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/current-teams\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-current-teams', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/mailed-invitations.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/mailed-invitations\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-mailed-invitations', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/pending-invitations.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/pending-invitations\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-pending-invitations', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/send-invitation.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/send-invitation\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-send-invitation', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/team-members.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/team-members\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-team-members', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/team-membership.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/team-membership\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-team-membership', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/team-profile.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/team-profile\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-team-profile', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/team-settings.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/team-settings\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-team-settings', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/update-team-name.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/update-team-name\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-team-name', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/js/spark-components/settings/teams/update-team-photo.js":
/***/ (function(module, exports, __webpack_require__) {

var base = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"settings/teams/update-team-photo\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

Vue.component('spark-update-team-photo', {
    mixins: [base]
});

/***/ }),

/***/ "./resources/sass/app-rtl.scss":
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: \r\n@import \"./../../vendor/laravel/spark-aurelius/resources/assets/sass/spark\";\r\n^\r\n      File to import not found or unreadable: ./../../vendor/laravel/spark-aurelius/resources/assets/sass/spark.\r\n      in C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\resources\\sass\\app.scss (line 2, column 1)\n    at runLoaders (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\webpack\\lib\\NormalModule.js:195:19)\n    at C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\loader-runner\\lib\\LoaderRunner.js:364:11\n    at C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\loader-runner\\lib\\LoaderRunner.js:230:18\n    at context.callback (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\loader-runner\\lib\\LoaderRunner.js:111:13)\n    at Object.asyncSassJobQueue.push [as callback] (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\sass-loader\\lib\\loader.js:55:13)\n    at Object.done [as callback] (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\neo-async\\async.js:8077:18)\n    at options.error (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\node-sass\\lib\\index.js:294:32)");

/***/ }),

/***/ "./resources/sass/app.scss":
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: \r\n@import \"./../../vendor/laravel/spark-aurelius/resources/assets/sass/spark\";\r\n^\r\n      File to import not found or unreadable: ./../../vendor/laravel/spark-aurelius/resources/assets/sass/spark.\r\n      in C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\resources\\sass\\app.scss (line 2, column 1)\n    at runLoaders (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\webpack\\lib\\NormalModule.js:195:19)\n    at C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\loader-runner\\lib\\LoaderRunner.js:364:11\n    at C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\loader-runner\\lib\\LoaderRunner.js:230:18\n    at context.callback (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\loader-runner\\lib\\LoaderRunner.js:111:13)\n    at Object.asyncSassJobQueue.push [as callback] (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\sass-loader\\lib\\loader.js:55:13)\n    at Object.done [as callback] (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\neo-async\\async.js:8077:18)\n    at options.error (C:\\Users\\Adam.Thomason\\projects\\php\\laravel\\cloudstrut\\node_modules\\node-sass\\lib\\index.js:294:32)");

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./resources/js/app.js");
__webpack_require__("./resources/sass/app.scss");
module.exports = __webpack_require__("./resources/sass/app-rtl.scss");


/***/ })

/******/ });