import Testool from "../Testool/Testool.js"
import { AUX } from "../../Flex.js-v1.0.0/Flex.js"

const AUXTest = new Testool({
    name: "AUX",
    root: AUX,
    title: "Teste dos módulos internos do namespace AUX"
})

//////////////////////
const map = new Map([
    ["say", "hello"],
    ["year", 2025],
    [123, "password"]
])

const fakeArr = { 0: "hello", 1: "foo", 2: 5.2 }
Object.defineProperty(fakeArr, "length", { value: 3 })

const set = new Set(["foo", "foo", "bar", true, 10])
const obj = { name: "foo", age: 27 }
Object.defineProperty(obj, "add", { value: true })

const prox = new Proxy({say: "hello"}, {get(){console.log("hello")}})
//////////////////////

AUXTest.set("getKeys", (args) => {
    args(obj).expect(["name", "age"])
    args(obj, 1).expect("age")
    args(map).expect(["say", "year", 123])
    args(new Testool()).expect([])
    args(fakeArr).expect(undefined) //Teste para um fake array-like
    args(set).expect(undefined)
    args(prox).expect(["say"])
    args(new Proxy([1, 2, 3], {})).expect()
    args(null).expect()
})

////////////////////////
//AUXTest.logLast()