import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AddJobView from "../views/AddJobView.vue";
import JobsView from "../views/JobsView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import JobView from "../views/JobView.vue";
import EditJobView from "../views/EditJobView.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/jobs',
            name: 'jobs',
            component: JobsView
        },
        {
            path: '/jobs/add',
            name: 'add-job',
            component: AddJobView
        }, 
        {
            path: '/jobs/:id',
            name: 'job-details',
            component: JobView
        },
        {
            path: '/jobs/edit/:id',
            name: 'job-edit',
            component: EditJobView
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
})


export default router;