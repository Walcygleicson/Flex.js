let ID = new Map()

export default function benchmark(fn, title) {
    if (typeof fn === "function") {
        var getId = ID.get(fn)
        //Salvar referência de id
        if (!getId) {
            getId = ID.size + 1
            ID.set(fn, getId)
        }

        if (title === undefined) {
            title = `Benchmark ${getId}: `
        }

        return {
            exec(...args) {
                //Exexcutar benchmark
                console.time(title);
                for (let i = 0; i < 100000; i++) {
                    fn(...args)
                }
                console.timeEnd(title);
            
        }}



    }
}