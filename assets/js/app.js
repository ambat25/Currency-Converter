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
        error_message :''
    },
    methods: {
        setUpConversionRate() {
            let self = this;
            this.convert_from_rate = 0;
            this.convert_to_rate = 0;
            let from_to = `${this.from_id}_${this.to_id}`
            let to_from = `${this.to_id}_${this.from_id}`
            console.log(`from to ${from_to.length}`)
            if (from_to.length === 7 && to_from.length === 7) {
                let myUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${from_to},${to_from}&compact=ultra`
                fetch(myUrl)
                    .then(res => res.json())
                    .then(res => {
                        self.convert_from_rate = res[to_from]
                        self.convert_to_rate = res[from_to]
                        console.log(res);
                        myDb.then(function (db) {
                            var tx = db.transaction('convertion-rate', 'readwrite')
                            var convertionRateStore = tx.objectStore('convertion-rate')
                            convertionRateStore.put(Object.values(res)[0],Object.keys(res)[0]);
                            convertionRateStore.put(Object.values(res)[1],Object.keys(res)[1]);
                            return tx.complete
                        })
                        .then(()=>{
                            self.error_message = ""
                            console.log('convertion rate is set')
                        })
                    })
                    .catch(err=>{
                        console.error(err);
                        console.log('error fetching convertion rate')
                        console.log('dont know why some things')
                        myDb.then(function (db) {
                            var tx = db.transaction('convertion-rate', 'readwrite')
                            var convertionRateStore = tx.objectStore('convertion-rate')
                            // convertionRateStore.clear()
                            convertionRateStore.get(from_to).then(val=>{self.convert_from_rate = val});
                            convertionRateStore.get(to_from).then(val=>{self.convert_to_rate = val});
                            return tx.complete
                        })
                        .then(()=>{
                            console.log('fetched from db')
                            self.error_message = ""
                            console.log("from to",self.convert_from_rate)
                            if(self.convert_from_rate == undefined){self.error_message = "Unable to fetch Conversion rate"}
                        })
                        .catch(()=>{self.error_message = "Unable to fetch Conversion rate"})
                        console.log('not going trough')
                        
                    })
            }
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
        }
    },
    created() {
        const self = this;
        console.log('created method');
        fetch('https://free.currencyconverterapi.com/api/v5/currencies')
            .then((res) => res.json())
            .then(data => {
                self.currencies = (data.results);
                myDb.then(function (db) {
                    var tx = db.transaction('currencies', 'readwrite');
                    var currenciesStore = tx.objectStore('currencies');
                    currenciesStore.clear();
                    currenciesStore.put(data.results, 'all_currencies');
                    // currenciesStore.get('all_currencies').then(val => console.log('NGN',val['NGN']));
                    
                    return tx.complete;
                }).then(function (data) {
                    console.log('added to database')
                })
                
            })
            .catch(err => {
                console.error('could not fetch',err)
                myDb.then(function (db) {
                    var tx = db.transaction('currencies', 'readwrite');
                    var currenciesStore = tx.objectStore('currencies');
                    currenciesStore.get('all_currencies').then(val=>{self.currencies = val})
                    // currenciesStore.get('all_currencies').then(val => console.log('NGN',val['NGN']));
                    
                    return tx.complete;
                }).then(function (data) {
                    console.log('fetched from database')
                })
            })

    },
    mounted(){
        console.log('mounted')
    }
})