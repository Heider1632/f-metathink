<template>
  <v-col cols="12">
      <v-layout v-if="CG.length !== 0">
        <v-flex xs4 v-for="(cg, key) in CG" :key="key"> 
          <v-card class="ml-3">
             <v-card-title class="justify-space-around pb-0">
              <p class="title pt-3">{{ cg.domain }}</p>
              <v-btn @click="remove(cg._id)" icon>
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <p class="subtitle text-center font-weight">Description</p>

              <h3>Nums of Mental States: {{ cg.StateMental.length }}</h3>

              <h3>Nums of Goals: {{ cg.Goal.length }}</h3>

              <h3>Nums of Actions:{{ cg.Action.length }}</h3>

              <h3>Nums of Objects: {{ cg.Object.length }}</h3>

            </v-card-text>
            <v-card-actions class="justify-end p-2">
               <v-tooltip left>
                <template v-slot:activator="{ on }">
                   <v-btn v-on="on" text icon color="primary"><v-icon>mdi-help</v-icon></v-btn>
                </template>
                <span>Cognitive model in JSON format</span>
              </v-tooltip> 
              <v-btn v-on="on" text icon @click="detail(cg._id)"><v-icon>mdi-code-json</v-icon></v-btn>
            </v-card-actions>
          </v-card>

        </v-flex>
      </v-layout>
      <template v-else>
          <v-alert type="warning"> not cognitive models, yet. </v-alert>
      </template>
  </v-col>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  data: () => ({
    CG: []
  }),
  computed: {
    ...mapGetters(['getUserId'])
  },
  mounted () {
    this.list()
  },
  methods: {
    list() {
      const config = {
        params: {
          "valor" : this.getUserId
        }
      }

      this.$http.get('/cognitiveModel/list', config)
      .then( response => {
          this.CG = response.data
      })
      .catch(e => console.log(e.message))
    },
    remove(_id){

      this.$http.post('/cognitiveModel/delete', { _id: _id })
      .then( response => {
          this.list()
      })
      .catch(e => console.log(e.message))
    },

    detail(_id){
      this.$router.push(`/detail/${_id}`)
    }
  }
}
</script>
