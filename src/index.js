const str = 'hello webpack';
setTimeout(() => {
    console.log(str + 11111);
}, 1000)

require ('./hello.less');

// 使用vue进行开发
import Vue from 'vue'
import Capp from './vue/Capp.vue';

new Vue({
    el: "#app",
    template: '<Capp/>',
    components: {
        Capp
    }
})