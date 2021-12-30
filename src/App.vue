<template>
  <div id="app">
    <div class="connectStatus" :class="{'connected':connected}"></div>
    <div class="message-window" ref="messagewindow" :style="'height: ' + messageWindowHeight + 'px;'">
      <div :key="index" v-for="(msg,index) in messages" class="message" v-html="msg"></div>
    </div>
    <div class="command-window" :style="'height: ' + commandWindowHeight + 'px;'">
      <textarea v-on:keyup.enter="send" v-model="cmd" class="command-input" multiple></textarea>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      cmd: '',
      messageWindowHeight: 0,
      commandWindowHeight: 70,
      connected: false,
      websock: null,
      messages: [],
      uid: null,
      token: ''
    }
  },
  created () {
    window.addEventListener('resize', this.setWindowHeight)
    window.addEventListener('beforeunload', this.websocketclose)
    this.setWindowHeight()
    this.initWebSocket()
  },
  destroyed () {
    console.log('destroyed')
    this.websocketclose()
  },
  methods: {
    initWebSocket () {
      const wsuri = 'ws://127.0.0.1:9898'
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    send () {
      console.log(this.cmd)
      if (this.cmd === '') {
        this.messages.push('please input command.')
        return
      }
      this.websocketsend(this.cmd)
      console.log(this.cmd)
      this.cmd = ''
    },
    scrollBottom () {
      this.$nextTick(function () {
        this.$refs.messagewindow.scrollTop = this.$refs.messagewindow.scrollHeight
      })
    },
    setWindowHeight () {
      if (window.innerHeight < 400) {
        this.commandWindowHeight = 70
        this.messageWindowHeight = window.innerHeight - 110
      } else {
        this.commandWindowHeight = 100
        this.messageWindowHeight = window.innerHeight - 140
      }
    },
    websocketonopen () {
      console.log('connected to server')
      this.websocketsend('I am coming')
      this.connected = true
    },
    websocketonerror () {
      this.initWebSocket()
    },
    websocketonmessage (msg) {
      console.log('reciver:', msg)
      var rets = msg.data.split('\n')
      for (let i = 0; i < rets.length; i++) {
        try {
          var obj = JSON.parse(rets[i])
          this.messages.push(obj.msg)
          console.log(obj)
          switch (obj.action) {
            case 'login':
              this.loginPlayer(obj)
              break
            case 'create':
              this.createPlayer(obj)
              break
          }
        } catch (e) {
          this.messages.push(rets[i])
        }
      }
      this.scrollBottom()
    },
    websocketsend (action) {
      let data = {
        act: action,
        token: this.token
      }
      this.websock.send(JSON.stringify(data))
    },
    websocketclose (e) {
      this.websocketsend('exit')
      console.log('disconnect.', e)
      this.connected = false
    },
    loginPlayer (obj) {
      console.log(123)
      this.token = obj.token
    },
    createPlayer (obj) {
      this.token = obj.token
    }
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: start;
  color: #2c3e50;
  background-color: black;
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  margin: 0px;
  padding: 0px;
  width: auto;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.connectStatus{
  position: absolute;
  width: 10px;
  height: 10px;
  top: 15px;
  right: 15px;
  background-color: red;
  border-radius: 50%;
  -webkit-animation-name: breathe;
  -webkit-animation-duration: 1500ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}

@keyframes breathe{
  0% {
    opacity: .4;
  }
  100% {
    opacity: 1;
  }
}

.connected{
  background-color: greenyellow;
}

.message-window{
  border: 1px solid gray;
  background-color: black;
  color: lightgray;
  text-align: start;
  margin: 5px;
  overflow-y: auto;
  overflow-x: hidden;
  overflow-wrap: break-word;
  padding: 10px;
  height: 270px;
}

.command-window{
  /* border: 1px solid gray; */
  background-color: black;
  color: lightgray;
  margin: 5px;
}
.command-input:focus{
  outline: 0;
}
.command-input{
  background-color: black;
  width: 100%;
  /* max-width: 100%; */
  display: block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  color: lightgray;
  font-size: 20px;
  padding: 10px;
}
</style>
