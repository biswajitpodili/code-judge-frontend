const data = fetch("http://192.168.43.228:8080/api/problems")

data.then((res) => {
    console.log(res)
})

