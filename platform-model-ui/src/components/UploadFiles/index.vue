<template>
  <div class="upload-files">
    <el-upload
      v-if="type === '1'"
      class="upload-demo"
      ref="uploadPhoto"
      action=""
      :on-remove="handleUploadPhotoRemove"
      :on-change="imgUploadPhotoBroadcastChange"
      :file-list="newRow[filedName]"
      :accept="fileType"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
    </el-upload>

    <el-upload
      v-if="type === '2'"
      class="upload-demo"
      ref="uploadFile"
      action=""
      :on-remove="handleUploadFileRemove"
      :on-change="imgUploadFileBroadcastChange"
      :file-list="newRow[filedName]"
      :accept="fileType"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Uploadfiles',
  props: {
    index: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => { }
    },
    filedName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadPhotoFileList: [],
      uploadFileFileList: []
    }
  },
  computed: {
    fileType(){
      if (this.type === '1') {
        return '.jpeg,.gif,.png,.jpg'
      } else if (this.type === '2') {
        return '.rar,.pdf,.PDF,.zip,.doc,.xls,.xlsx,.jpeg,.gif,.png,.jpg'
      }
    },
    newRow() {
      return Object.assign({}, this.row)
    }
  },
  watch: {
    fileList: {
      handler(val) {
        if (this.type === '1') {
          this.newRow[this.filedName] = val
        } else if (this.type === '2') {
          this.newRow[this.filedName] = val
        }
      },
      deep: true
    }
  },
  methods: {
    //删除图片时
    handleUploadPhotoRemove(file, fileList) {
      //更新fileList
      this.uploadPhotoFileList = fileList
      const params = {
        index: this.index,
        row: this.newRow
      }
      this.$emit('updateFn', params)
    },
    /**
     * 上传图片
     * @param file
     */
    imgUploadPhotoBroadcastChange(file, fileList) {
      const isLtM = file.size / 1024 / 1024 < 10
      if (!isLtM) {
        this.newRow[this.filedName] = Object.assign([],fileList)
        this.newRow[this.filedName].splice(this.newRow[this.filedName].length-1,1)
        this.$message.error('文件大小不能超过 10M!')
        return false
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = (e) => {
          file.base64Str = e.target.result
          if(!this.newRow[this.filedName]){
            this.newRow[this.filedName] = []
          }
          this.newRow[this.filedName].push(file)
          const params = {
            index: this.index,
            row: this.newRow
          }
          this.$emit('updateFn', params)
        }
      }
    },
    //删除文件时
    handleUploadFileRemove(file, fileList) {
      //更新fileList
      this.newRow[this.filedName] = fileList
      const params = {
        index: this.index,
        row: this.newRow
      }
      this.$emit('updateFn', params)
    },
    /**
     * 上传文件
     * @param file
     */
    imgUploadFileBroadcastChange(file, fileList) {
      const isLtM = file.size / 1024 / 1024 < 10
      if (!isLtM) {
        this.newRow[this.filedName] = Object.assign([], fileList)
        this.newRow[this.filedName].splice(this.newRow[this.filedName].length - 1, 1)
        this.$message.error('文件大小不能超过 10M!')
        return false
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = (e) => {
          file.base64Str = e.target.result
          if(!this.newRow[this.filedName]){
            this.newRow[this.filedName] = []
          }
          this.newRow[this.filedName].push(file)
          const params = {
            index: this.index,
            row: this.newRow
          }
          this.$emit('updateFn', params)
        }
      }
    },
  }
}
</script>
