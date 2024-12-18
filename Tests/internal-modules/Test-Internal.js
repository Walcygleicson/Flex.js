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

const body = document.body
const nodeList = body.children
const htmlCollection = body.childNodes

const fakeArr = { 0: "hello", 1: "foo", 2: 5.2 }
Object.defineProperty(fakeArr, "length", { value: 3 })

const failFakeArr = { 0: "walcy", 1: "paty", key: "foo" }
Object.defineProperty(failFakeArr, "length", {value: 3})

const set = new Set(["foo", "foo", "bar", true, 10])
const obj = { name: "foo", age: 27 }
Object.defineProperty(obj, "add", { value: true })

const prox = new Proxy({ say: "hello" }, { get() { console.log("hello proxy!") } })
const arr = ["blue", 2.5, true]
//////////////////////

AUXTest.set("getKeys", (args) => {
    args(obj).expect(["name", "age"])
    args(obj, 1).expect("age")
    args(map).expect(["say", "year", 123])
    args(new Testool()).expect([])
    args(fakeArr).expect(undefined) //Teste para um fake array-like
    args(failFakeArr).expect(["0","1","key"])
    args(set).expect(undefined)
    args(prox).expect(["say"])
    args(new Proxy([1, 2, 3], {})).expect(undefined)
    args(null).expect(undefined)
    args(body).expect(undefined)
    args(nodeList).expect(undefined)
    args(htmlCollection).expect(undefined)
})

AUXTest.set("getValues", (args) => {
    args(obj).expect(["foo", 27])
    args(null).expect(undefined)
    args(fakeArr).expect(undefined)
    args(failFakeArr).expect(["walcy", "paty", "foo"])
    args(map).expect(["hello", 2025, "password"])
    args(arr).expect(undefined)
    args(body).expect(undefined)
    args(nodeList).expect(undefined)
    args(htmlCollection).expect(undefined)
    args(obj, 1).expect(27)
    args(obj, 5).expect(undefined)
    args(obj, "0").expect("foo")
    args(obj, "hello").expect(undefined)
})

////////////////////////
//AUXTest.logAll()