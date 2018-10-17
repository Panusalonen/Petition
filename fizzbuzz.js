/////// FIZZBUZZ REMEMBER THIS ///////

function fizzbuzz (n) {
    let counter = 1;

    while (counter <= n){
        if (counter % 3 === 0 && counter % 5 === 0) {
            console.log("fizzbuzz");
        } else if (counter % 3 === 0){
            console.log("fizz");
        }  else if (counter % 5 === 0) {
            console.log("buzz");
        }
        console.log(counter);
        counter ++;
    }
}

fizzbuzz(21);

/////// FIZZBUZZ REMEMBER THIS ///////
