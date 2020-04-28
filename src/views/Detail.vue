<template>
  <v-col cols="12">
      <template v-if="CG !== undefined">
          <pre>{{ CG }}</pre>
      </template>
      <template v-else>
          <v-alert type="warning"> No existe el modelo cognitivo.</v-alert>
      </template>
  </v-col>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'detail',
  data: () => ({
    CG: undefined
  }),
  computed: {
    ...mapGetters(['getUserId'])
  },
  mounted () {
    this.one()
  },
  methods: {
    one() {
      const config = {
        params: {
          "valor" : this.getUserId
        }
      }

      this.$http.get(`/cognitiveModel/query?_id=${this.$route.params._id}`, config)
      .then( response => {
          this.CG = response.data
      })
      .catch(e => console.log(e.message))
    },
  }
}
</script>
