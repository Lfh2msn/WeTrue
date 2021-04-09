import Vue from 'vue'
import mixinsMobile from './mixinsMobile'
const Plugins = [mixinsMobile]
Plugins.map((plugin) => {
    Vue.use(plugin)
})
export default Vue
