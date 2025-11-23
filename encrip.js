const bcrypt = require('bcryptjs')

function main(){
    const valid = bcrypt.compareSync("1234567","$2b$10$IBwrUprA5ipfb/Luy9MVtepFEuNOpmKQ/pVkwxjteyZ56v5tCt5ra");
    console.log(valid)
}

main();
