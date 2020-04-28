<template>
    <v-col cols="12">
        <template v-if="board == false">
            <h1 class="display-3">Create</h1>
            <v-layout align="center" justify="center">
            <v-flex xs10>
            <v-text-field
                class="mt-3"
                label="Nombre Modelo Cognitivo"
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
            Ir
            <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
            </v-flex>
            </v-layout>
        </template>
        <v-layout row wrap justify-center>
            <v-flex d-flex xs12 fill-height>
                <draggable class="board" :list="graphModel" group="people" @change="log">
                    <canvas id="target-canvas"></canvas>
                </draggable>
            </v-flex>
            <v-btn style="margin-top: 150px;" v-if="board == true" text block @click="save">
                Save
            </v-btn>
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
                    >Create</v-btn>
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
        name: '',
        board: false,
        canvas: '',
        source: ``,
        graphModel: [],
        cognitiveModel: {},
        dialog: false,
        title: '',
        text: '',
        BasicElement: ''
    }),
    mounted() {
        this.canvas = document.getElementById("target-canvas")
    },
    methods : {
        showBoard(){
            if (this.name !== ''){
                this.source+=`[${this.name}] \n`;
                this.board = true;
                this.$store.commit('setNavbarItems', [
                    { icon: 'mdi-lightbulb', text: 'View', path: '/' },
                    { divider: true },
                    { heading: 'Cognitive Elements' },
                    { icon: 'mdi-plus-circle-outline', text: 'Goal' },
                    { icon: 'mdi-plus-circle-outline', text: 'StateMental'},
                    { icon: 'mdi-plus-circle-outline', text: 'Action' },
                    { icon: 'mdi-plus-circle-outline', text: 'Object' }
                ])
                this.$store.commit('setType', 'draggable')
            } else {
                this.board = false
                this.$store.commit('setNavbarItems', [
                    { icon: 'mdi-lightbulb', text: 'View', path: '/' },
                    { divider: true },
                    { heading: 'Routes' },
                    { icon: 'mdi-plus-circle-outline', text: 'Create new CG', path: '/new' }
                ])
                this.$store.commit('setType', 'list')
            }

            this.draw()
        },
        draw () {
            nomnoml.draw(this.canvas, this.source);
        },
        addElementToCognitiveModelGraph () {

            String.prototype.splice = function(idx, rem, str) {
                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
            };
        

            if (this.source.search(this.BasicElement) !== -1){

                this.cognitiveModel[this.BasicElement].push(this.text)
                
                let index = this.source.indexOf(this.BasicElement);

                let regex = index + this.BasicElement.length + this.text.length

                var result = this.source.splice(regex + 1, 0, '|' + this.text)

                this.source = result;
            } else {
                this.cognitiveModel[this.BasicElement] = [];

                this.cognitiveModel[this.BasicElement].push(this.text)

                this.source+=`[${this.BasicElement}|${this.text}] \n`

                this.source+=`[${this.name}]->[${this.BasicElement}] \n`
            }

            this.draw()

            this.dialog = false;
        },
        log(evt){
            // console.log(evt)
            this.dialog = true;
            this.BasicElement = evt.added.element.text;
            if (this.BasicElement == "Goal"){
                this.title = 'New Goal'
            } else if (this.BasicElement == "StateMental") {
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