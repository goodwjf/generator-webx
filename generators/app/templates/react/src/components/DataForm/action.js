import PubSub from 'pubsub-js'

let pubsubEditer = null;

let mountEditer = (callback) => {
  pubsubEditer = PubSub.subscribe('showEditer', (topic, { formData, from }) => {
    callback(topic, formData, from)
  })
}

let showEditer = (formData, from) => {
  PubSub.publish('showEditer', { formData, from })
}

let unMountEditer = () => {
  PubSub.unsubscribe(pubsubEditer)
}

export default {
  mountEditer,
  showEditer,
  unMountEditer
}