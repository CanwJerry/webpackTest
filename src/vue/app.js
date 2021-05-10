export default {
    template:`<div>
        <h2>{{message}}</h2>
        <button @click="btnclick">按钮</button>
    </div>`,
    data() {
        return {
            message: "helloVue"
        }
    },
    methods: {
        btnclick() {
            console.log('这是啥');
        }
    }
}