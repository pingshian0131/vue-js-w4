import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import axios from 'axios'
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import {createApp} from 'vue'
import App from './App.vue'

/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {faEdit, faStar, faStarHalfAlt, faSuitcase, faTrash, faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faSuitcase, faEdit, faTrash, faStar, faStarHalfAlt, faArrowUpFromBracket)

const app = createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
app.config.globalProperties.$axios = axios;
app.use(VueSweetalert2);
app.use(LoadingPlugin, {
    color: '#0d6efd',
    loader: 'dots',
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
})
app.mount('#app');
