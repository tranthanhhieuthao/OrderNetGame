<template>
  <div class="create">
   <el-table
   :data="dataUser">
   <el-table-column
    label="STT"
    width ="180"
    type="index"
     />
     <el-table-column
    label="Name"
    width ="180"
    prop="username"
     />
     <el-table-column
    label="PhoneNumber"
    width ="180"
    prop="phoneNumber"
     />
      <el-table-column
    label="Email"
    min-width ="190"
    prop="email"
     />
      <el-table-column
    label="Money current"
    width ="180"
    prop="moneyCurrent"
     />
      <el-table-column
    label="Money history"
    width ="180"
    prop="historyMoney"
     />
      <el-table-column
    label="PC name"
    width ="180"
    prop="pcName"
     />
      <el-table-column
    label="Time remain"
    width ="180"
    prop="timeRemain"
     />
      <el-table-column
    label="Status"
    width ="180"
    prop="statusCurent"
     />
   </el-table>
     <div class="block">
    <!-- <el-pagination
      :total="total"
      :page.sync="rowDataQuery.page"
      :limit.sync="rowDataQuery.size"
      @current-change="getDataUser"
      layout="prev, pager, next, jumper"
    /> -->
  </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      addDialog: false,
      dataUser: [],
      token: {
        idToken: '',
        email: ''
      },
      total: 0,
      rowDataQuery: {
        page: 1,
        size: 10
      },
      options: [
        {
          label: 'Online',
          value: true
        },
        {
          label: 'Offine',
          value: false
        }
      ]
    }
  },
  mounted() {
    this.getDataUser()
  },
  methods: {
    getDataUser() {
      this.dataUser = []
      var db = firebase.firestore()
      db.collection('User').get().then(res => {
        res.forEach(e => this.dataUser.push(e.data()))
        this.dataUser.forEach(e => { res.forEach(re => { e.id = re.id }) })
        this.convertStatus()
      })
    },
    convertStatus() {
      this.dataUser.forEach(e => {
        if (e.status || e.pcName !== 0) e.statusCurent = 'Online'
        else e.statusCurent = 'Offine'
      })
    },
    handleSizeChange(val) {
      console.log(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.create {
  margin-top:20px;
}
</style>
