import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from './en';
import zhLocale from './zh';
import { getStore } from '@/util/service';
Vue.use(VueI18n);
const messages = {
	en: {
		...enLocale
	},
	zh: {
		...zhLocale
	},
};

const i18n = new VueI18n({
	locale: getStore('language') || 'zh',
	messages,
});

export default i18n;
