export let createPrimaryKey = () => {
  return Date.now() + (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}