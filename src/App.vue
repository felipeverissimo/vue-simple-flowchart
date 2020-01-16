<template>
  <div id="app">
    <h1>simple flowchart</h1>
    <simple-flowchart
      :scene.sync="scene"
      @not-allowed="teste"
      @nodeDelete="nodeDelete"
      @linkBreak="linkBreak"
      @linkAdded="linkAdded"
      @canvasClick="canvasClick"
      :height="800"
    />
  </div>
</template>

<script>
import SimpleFlowchart from "./components/SimpleFlowchart.vue";

export default {
  name: "app",
  components: {
    SimpleFlowchart
  },
  data () {
    return {
      scene: {
        centerX: 1024,
        centerY: 140,
        scale: 1,
        nodes: [
          {
            id: 1,
            x: -700,
            y: -139,
            type: "Start",
            label: "Start",
            disabled: true
          },
          {
            id: 2,
            x: -700,
            y: 0,
            type: "Action",
            label: "test1",
            disabled: true
          },
          {
            id: 9,
            x: -700,
            y: 0,
            type: "Action",
            label: "Este e um texto gigante para 5 linhas, gigante para 5 linhas, gigante para 5 linhas gigante para 5",
            disabled: false,
            width: 400
          },
          {
            id: 60,
            x: -700,
            y: 0,
            type: "Action",
            label: "Este e um texto gigante para 5 linhas, gigante para 5 linhas, gigante para 5 linhas ",
            disabled: false,
            width: 400
          },
          {
            id: 52,
            x: -700,
            y: 0,
            type: "Action",
            label: "Este e um texto gigante para 5 linhas, gigante para 5 linhas, gigante para 5 linhas ",
            disabled: false,
            width: 400
          },
          {
            id: 4,
            x: -357,
            y: 80,
            type: "Decision",
            label: "decisáo",
            disabled: false
          },
          {
            id: 6,
            x: -557,
            y: 80,
            type: "Join",
            label: "test1",
            disabled: false
          }
        ],
        links: [
          {
            id: 5,
            from: 1, // node id the link start
            to: 2, // node id the link end
            label: ""
          },
          {
            id: 3,
            from: 2, // node id the link start
            to: 4, // node id the link end
            label: ""
          }
        ]
      }
    };
  },
  methods: {
    teste () {
      alert("Operação não permitida app");
    },
    canvasClick (e) {
      // console.log("canvas Click, event:", e);
    },
    nodeClick (id) {
      // console.log("node click", id);
    },
    nodeDelete (id) {
      // console.log("node delete", id);
    },
    linkBreak (id) {
      // console.log("link break", id);
    },
    linkAdded (link) {
      // console.log("new link added:", link);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  overflow: hidden;
  height: 800px;
}
</style>
