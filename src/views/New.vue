<template>
    <v-col cols="12">
        <v-layout class="mb-3 justify-end">
             <v-tooltip left>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon color="primary"><v-icon>mdi-help</v-icon></v-btn>
                </template>
                <span>{{ helper }}</span>
            </v-tooltip>
        </v-layout>
        <template v-if="board == false">
            <h1 class="display-3">Create</h1>
            <v-layout align="center" justify="center">
            
            <v-flex xs10>
            <v-text-field
                class="mt-3"
                label="Name of new cognitive model"
                outlined
                v-model="name"
            ></v-text-field>
            </v-flex>
            <v-flex xs2>
            <v-btn
                class="mt-4"
                outlined
                x-large
                text
                block
                color="blue acient-4"
                @click="showBoard"
            >
            Go
            <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
            </v-flex>

            </v-layout>
            <v-alert v-if="message" class="mt-2" type="warning">{{ message }}</v-alert>
        </template>
        <v-layout row wrap justify-center>
            <v-flex d-flex xs12 fill-height>
                <draggable class="board" :list="graphModel" group="people" @change="log">
                    <canvas id="target-canvas"></canvas>
                </draggable>
            </v-flex>
            <v-layout justify-space-between class="mx-auto" style="margin-top: 200px;">
            <v-flex xs8>
            <v-btn v-if="board == true" color="primary" text block @click="save">
                Save
            </v-btn>
            </v-flex>
            <v-flex xs4 class="text-xs-center">
            <v-btn v-if="board == true" color="red" text block @click="cancel">
                <v-icon>mdi-cancel</v-icon>
            </v-btn>
            </v-flex>
            </v-layout>
        </v-layout>
       
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title> {{ title }}</v-card-title>
                <v-card-text>
                    <v-flex xs12>
                    <v-text-field 
                        label="Name Item"
                        v-model="text"
                        outlined
                    />
                    </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-btn 
                        color="green darken-1" 
                        text @click="addElementToCognitiveModelGraph"
                    >Create
                    </v-btn>
                    <v-btn 
                        color="red" 
                        text @click="dialog = false"
                    >
                    <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-col>
</template>
<script>
import nomnoml from 'nomnoml';
import draggable from 'vuedraggable'
export default {
    name: 'Add',
    components: {
        draggable
    },
    data: () => ({
        helper: 'name of new cognitive model',
        message: null,
        name: '',
        board: false,
        canvas: '',
        source: ``,
        graphModel: [],
        cognitiveModel: {},
        dialog: false,
        title: '',
        text: '',
        historyElements: 0,
        BasicElement: ''
    }),
    mounted() {
        this.canvas = document.getElementById("target-canvas")
    },
    watch: {
        message (val) {
            var $this = this;
            if (val){
                setTimeout( () => {
                    $this.message = null
                }, 3000)
            }
        },
        board (val){
            if(val){
                this.helper = 'To add a new cognitive element, drag and drop any element located on the left side of the screen and drop it in the blank space'
            } else {
                this.helper = 'name of new cognitive model'
            }
        }
    },
    methods : {
        showBoard(){
            if (this.name !== ''){

                this.$http.get(`/cognitiveModel/validate?name=${this.name}`)
                .then(response => {

                    if(response.data.valid){

                        this.source+=`[${this.name}] \n`;
                        this.board = true;
                        this.$store.commit('setNavbarItems', [
                            { icon: 'mdi-lightbulb', text: 'Cognitive Models List', path: '/' },
                            { divider: true },
                            { heading: 'Cognitive Elements' },
                            { icon: 'mdi-plus-circle-outline', text: 'Goal', isHelper: true, message : '' },
                            { icon: 'mdi-plus-circle-outline', text: 'MentalState',  isHelper: true, message : ''},
                            { icon: 'mdi-plus-circle-outline', text: 'Action',  isHelper: true, message : ''  },
                            { icon: 'mdi-plus-circle-outline', text: 'Object',  isHelper: true, message : ''  }
                        ])

                        this.$store.commit('setType', 'draggable')

                        this.draw()

                    } else {

                        this.message = `the cognitive model ${this.name} exist`;
                    }
                  
                })
                .catch(e => console.log(e.message))
                
            } else {
                this.board = false
                this.$store.commit('setNavbarItems', [
                    { icon: 'mdi-lightbulb', text: 'Cognitive Models List', path: '/' },
                    { divider: true },
                    { heading: 'Routes' },
                    { icon: 'mdi-plus-circle-outline', text: 'Create a new CG', path: '/new' }
                ])
                this.$store.commit('setType', 'list')
            }

            
        },
        draw () {
            nomnoml.draw(this.canvas, this.source);
        },
        addElementToCognitiveModelGraph () {

            String.prototype.splice = function(idx, rem, str) {
                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
            };

            if(this.text !== ''){
                if (this.source.search(this.BasicElement) !== -1){

                if(this.cognitiveModel[this.BasicElement].length > 1){

                    this.historyElements = this.cognitiveModel[this.BasicElement].length;
                } else {
                    this.historyElements = 1;
                }

                this.cognitiveModel[this.BasicElement].map(e => {
                    this.historyElements += e.length
                })

                this.cognitiveModel[this.BasicElement].push(this.text)
                
                let index = this.source.indexOf(this.BasicElement);

                let regex = index + this.BasicElement.length + this.historyElements

                var result = this.source.splice(regex, 0, '|' + this.text)

                this.source = result;


                } else {

                    this.cognitiveModel[this.BasicElement] = [];

                    this.cognitiveModel[this.BasicElement].push(this.text)

                    this.source+=`[${this.BasicElement}|${this.text}] \n`

                    this.source+=`[${this.name}]->[${this.BasicElement}] \n`
                }

                this.draw()
            }

            this.dialog = false;
        },
        log(evt){
            // console.log(evt)
            this.dialog = true;
            this.BasicElement = evt.added.element.text;
            if (this.BasicElement == "Goal"){
                this.title = 'New Goal'
            } else if (this.BasicElement == "MentalState") {
                this.title = 'New State Mental'
            } else if (this.BasicElement == "Action") {
                this.title = 'New Action'
            } else if (this.BasicElement == "Object") {
                this.title = 'New Object'
            } else {

            }
        },
        save () {
            this.cognitiveModel.User = this.$store.state.user._id
            this.cognitiveModel.domain = this.name

            this.$http.post('/cognitiveModel/add', this.cognitiveModel)
            .then(response => {
                this.$router.push('/')
            })
            .catch(e => console.log(e.message))
        },
        cancel(){
            this.$router.push('/')
        }
    }
}
</script>
<style scoped>
.v-dialog {
    position: absolute;
    bottom: 0;
    right: 0;
}

.board {
    height: 100%; 
    width: 100%;
    text-align: center;
}
</style>