

function main(args){
    console.info( JSON.stringify(args) );
}


if (require.main === module) {
    main(process.argv);
}else{
    module.exports = main;
}
