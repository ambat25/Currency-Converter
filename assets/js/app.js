const app = new Vue({
    el: '#app',
    data: {
        app_name: 'Currency Converter',
        currencies: {},
        from_id: '',
        to_id: '',
        from_name: '',
        to_name: '',
        from_val: 0,
        to_val: 0,
        convert_from_rate: 0,
        convert_to_rate: 0,
    },
    methods: {
        setUpConversionRate() {
            let from_to = `${this.from_id}_${this.to_id}`
            let to_from = `${this.to_id}_${this.from_id}`
            let myUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${from_to},${to_from}&compact=ultra`
            fetch(myUrl)
                .then(res => res.json())
                .then(res => {
                    this.convert_from_rate = res[to_from]
                    this.convert_to_rate = res[from_to]
                })
        },
        toSelectChange() {
            this.to_name = this.currencies[this.to_id].currencyName
            this.setUpConversionRate()
        },
        fromSelectChange() {
            this.from_name = this.currencies[this.from_id].currencyName
            this.setUpConversionRate()
        },
        fromChange() {
            this.to_val = (Number(this.from_val) * Number(this.convert_to_rate)).toFixed(2)
        },
        toChange() {
            this.from_val = (Number(this.to_val) * Number(this.convert_from_rate)).toFixed(2)
        },
    },
    created() {
        fetch('https://free.currencyconverterapi.com/api/v5/currencies')
            .then((res) => res.json())
            .then(data => {
                console.log(data.results);
                this.currencies = (data.results);
            })
    }
})