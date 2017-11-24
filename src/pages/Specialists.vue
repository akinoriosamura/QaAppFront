<template>
<v-ons-page id="specialist">
  <v-ons-list-item v-for="item in items" tappable>
          <div class="left">
            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
          </div>
          <div class="center">
            <span class="list-item__title">{{item.title}}</span>
              <span class="list-item__subtitle">{{item.subtitle}}</span>
          </div>
        </v-ons-list-item>
</v-ons-page>

</template>

<script>
export default{
  data(){
    return{
      items:[
        {
          title:'中條裕章',
          subtitle:'社畜'
        },
        {
          title:'納村あきのり',
          subtitle:'フリーランス・人工知能エンジニア。専門は自然言語処理'
        }
      ]
    };
  }
}
</script>
