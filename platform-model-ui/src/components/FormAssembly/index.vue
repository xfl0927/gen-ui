<template>
  <div class="formAsseBox">
    <el-form
      ref="formAsse"
      status-icon
      :model="formValue"
      :label-width="formData.labelWidth"
      :label-position="formData.labelPosition"
    >
      <el-row :gutter="formData.gutter">
        <el-col :span="item.editType == 'transfer' || item.editType == 'rich_text'? 24:formData.span" v-for="(item,index) in formData.formList" :key="index" :xs="item.xs" :sm="item.sm" :md="item.md" :lg="item.lg" :xl="item.lg">
          <el-form-item  v-if="item.editType == 'text'" :prop="item.prop" :label="item.label" :rules="item.rules">
           <el-input
              class="widthHundred"
              v-model.trim="formValue[item.prop]"
              :placeholder="'请输入'+item.label"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item  v-if="item.editType == 'number'" :prop="item.prop" :label="item.label" :rules="item.rules" >
           <el-input
            class="widthHundred"
            v-model.number.trim="formValue[item.prop]"
            :placeholder="'请输入'+item.label+',纯数字'"
            :clearable="true"
          />
          </el-form-item>
          <el-form-item  v-if="item.editType == 'textarea'" :prop="item.prop" :label="item.label" :rules="item.rules" >
           <el-input
            class="widthHundred"
            v-model.trim="formValue[item.prop]"
            type="textarea"
            placeholder="请填写内容"
            :clearable="true"
            :show-word-limit="true"
            :autosize="{ minRows: 3, maxRows: 5 }"
            :maxlength="100"
          />
          </el-form-item>
          <el-form-item v-if="item.editType == 'icon_select'" :label="item.label" :prop="item.prop" :rules="item.rules" >
            <icon-select
              :ref="'icon-'+item.prop"
              v-model="formValue[item.prop]"
              placeholder="请选择图标"
              @handlesetIconName="handlesetIcon($event,item.prop)" />
          </el-form-item>
          <el-form-item v-if="item.editType == 'color_select'" :label="item.label" :prop="item.prop" :rules="item.rules" >
            <el-color-picker
              v-model="formValue[item.prop]"
              :predefine="predefineColors">
            </el-color-picker>
          </el-form-item>
          <el-form-item  v-if="item.editType == 'select' || item.editType == 'multi_select'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-select
              class="widthHundred"
              v-model="formValue[item.prop]"
              :multiple="item.editType == 'select' ? false : true"
              :clearable="true"
              :placeholder="'请选择'+item.label"
              :filterable="true"
            >
              <el-option
                v-for="item1 in item.options"
                :key="item1.id"
                :label="item1.label"
                :value="item1.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item  v-if="item.editType == 'time'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-time-picker
              class="widthHundred"
              v-model="formValue[item.prop]"
              :is-range="item.isRange"
              :placeholder="'请选择'+item.label"
              :start-placeholder="'请选择开始'+item.label"
              :end-placeholder="'请选择结束'+item.label"
              :editable="true"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item  v-if="item.editType == 'date' || item.editType == 'datetime'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-date-picker
              class="widthHundred"
              v-model="formValue[item.prop]"
              :type="item.type"
              :placeholder="'请选择'+item.label"
              :start-placeholder="'请选择开始'+item.label"
              :end-placeholder="'请选择结束'+item.label"
              :editable="true"
              :clearable="true"
              :value-format="item.timestamp ? 'timestamp' : item.format"
              :format="item.format"
            />
          </el-form-item>
          <el-form-item  v-if="item.editType == 'radio'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-radio-group v-model="formValue[item.prop]" >
              <el-radio v-for="(item1,index) in item.options" :key="index" :label="item1.value" >{{item1.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  v-if="item.editType == 'checkbox'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-checkbox-group v-model="formValue[item.prop]" >
              <el-checkbox  v-for="(item1,index) in item.options" :key="index" :label="item1.value">{{item1.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item  v-if="item.editType == 'switch'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-switch
              class="widthHundred"
              v-model="formValue[item.prop]"
              active-text="开"
              inactive-text="关"
              active-color="#13ce66"
              inactive-color="#C0CCDA"
              :active-value="true"
              :inactive-value="false"
            >
            </el-switch>
          </el-form-item>
          <el-form-item  v-if="item.editType == 'image' || item.editType == 'file'"  :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-upload
              class="upload-demo"
              :ref="item.editType == 'image' ? 'image-'+item.prop : 'file-'+item.prop"
              action=""
              :multiple="true"
              :file-list="formValue[item.prop]"
              :limit="item.limit"
              :on-exceed="(files,fileList)=>{handleExceed(files,fileList,item)}"
              :on-remove="(file,fileList)=>{handleOnRemove(file,fileList,item)}"
              :on-change="(file,fileList)=>{handleOnChange(file,fileList,item)}"
              :before-remove="beforeRemove"
              :accept="item.editType == 'image' ? '.jpeg,.gif,.png,.jpg' : '.rar, .pdf, .PDF, .zip, .doc, .xls, .xlsx, .jpeg, .gif, .png, .jpg'"
              :auto-upload="false"
           >
              <el-button slot="trigger" type="primary">{{item.editType == 'image' ? '上传图片' : '上传文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">{{item.editType == 'image' ? '只能上传.jpeg,.gif,.png,.jpg格式的图片' : '只能上传.rar,.pdf,.PDF,.zip,.doc,.xls,.xlsx,.jpeg,.gif,.png,.jpg格式的文件'}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item class="treeForm" v-if="item.editType == 'tree_select'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <tree-select
              v-model="formValue[item.prop]"
              :multiple="item.multiple"
              :options="item.options"
              :placeholder="'请选择'+item.label"
              :disable-branch-nodes="false"
              :searchable="true"
              />
              <!-- <treeselect-value :value="formValue[item.prop]" /> -->
          </el-form-item>
          <el-form-item class="formTransfer" v-if="item.editType == 'transfer'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-transfer
              filterable
              v-model="formValue[item.prop]"
              :data="item.data"
              :render-content="renderFunc"
            >
            </el-transfer>
          </el-form-item>
          <el-form-item v-if="item.editType == 'cascade_select'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-cascader
              class="widthHundred"
              v-model="formValue[item.prop]"
              clearable
              filterable
              :options="item.options"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item v-if="item.editType == 'rate_score'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-rate
              v-model="formValue[item.prop]"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              show-text>
            </el-rate>
          </el-form-item>
          <el-form-item v-if="item.editType == 'rich_text'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <Tinymce :ref="'editor-' + item.prop" v-model="formValue[item.prop]" :height="item.height" />
          </el-form-item>
          <el-form-item class="tagItem" v-if="item.editType == 'tag_select'" :prop="item.prop" :label="item.label" :rules="item.rules" >
            <el-tag
              size="samll"
              class="tagBox"
              v-for="(tag,index) in formValue[item.prop]"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleClose(tag,item.prop)">
              {{tag}}
            </el-tag>
            <el-input
              size="small"
              class="input-new-tag tagBox"
              :class="formValue[item.prop]&&formValue[item.prop].length>0?'':'tagBoxBtn'"
              v-show="formValue['tagVisible-'+item.prop]"
              v-model="formValue['tagValue-'+item.prop]"
              :ref="'tag-'+item.prop"
              @keyup.enter.native="handleInputConfirm(item.prop,formValue[item.prop])"
              @blur="handleInputConfirm(item.prop,formValue[item.prop])"
            >
            </el-input>
            <el-button v-show="!formValue['tagVisible-'+item.prop]" :class="formValue[item.prop]&&formValue[item.prop].length>0?'':'tagBoxBtn'" class="button-new-tag tagBox" size="small"  @click="showInput(item.prop)">+ New Tag</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 主子表 start -->
      <el-tabs v-if="mainSubTable && mainSubTable.length>0" v-model="activeName" type="card" class="tabsBox" @tab-click="handleClickTabs">
        <el-tab-pane v-for="(item,index) in mainSubTable" :key="index" :label="item.title" :name="item.name">
          <el-button v-if="item.addBtn" class="filter-item tabBtn" icon="el-icon-plus" plain @click="handAddNewRow(item.name)">新增一行</el-button>
          <el-button v-if="item.deleteBtn" class="filter-item tabBtn" icon="el-icon-minus" plain @click="handleDeleteBatchRow(item.name,index)">批量删除</el-button>
          <el-table
            :data="formValue[item.name]"
            highlight-current-row
            :ref="'table-'+item.name"
            @selection-change="selectionChange($event,item.name)"
            border
            stripe
            style="width: 100%;"
            fit
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              v-for="(item1,index1) in item.insertList"
              :key="index1"
              :prop="item1.jfieldName"
              :label="item1.fieldDesc"
              header-align="center"
              align="center"
              :min-width="item1.width"
            >
              <template slot-scope="scope">
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'text'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请输入'+item1.fieldDesc, trigger: ['blur','change'] },
                    { max: 50, message: '长度不能超过50个字符', trigger: ['blur','change']}
                  ]">
                  <el-input
                    v-model.trim="scope.row[item1.jfieldName]"
                    :placeholder="'请输入'+item1.fieldDesc"
                    :clearable="true"
                  />
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'number'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请输入数字', trigger: ['blur','change'] },
                    { type: 'number', message: '必须为数字值', trigger: ['blur','change'] }
                  ]">
                  <el-input
                    v-model.number.trim="scope.row[item1.jfieldName]"
                    placeholder="请输入数字"
                    :clearable="true"
                  />
                  <!-- v-model.number.trim="formValue[item.name][scope.$index][item1.jfieldName]"-->
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'textarea'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请输入内容', trigger: 'blur' }
                  ]">
                  <el-input
                    v-model.trim="scope.row[item1.jfieldName]"
                    type="textarea"
                    :placeholder="'请填写'+item1.fieldDesc"
                    :clearable="true"
                    show-word-limit
                    :autosize="{ minRows: 1, maxRows: 5 }"
                    :maxlength="100"
                  />
                </el-form-item>
                <el-form-item
                  label-width="0"
                  v-if="item1.editType == 'rate_score'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                >
                  <el-rate
                    v-model="scope.row[item1.jfieldName]"
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                    show-text>
                  </el-rate>
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  class="tagItem"
                  v-if="item1.editType == 'tag_select'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请编写标签', trigger: ['change'] }
                  ]"
                >
                  <el-tag
                    size="samll"
                    class="tagBox"
                    v-for="(tag,index2) in scope.row[item1.jfieldName]"
                    :key="index2"
                    closable
                    :disable-transitions="false"
                    @close="handleCloseTag(tag,item.name,scope.$index,item1.jfieldName)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    size="small"
                    class="input-new-tag tagBox"
                    :class="scope.row[item1.jfieldName]&&scope.row[item1.jfieldName].length>0?'':'tagBoxBtn'"
                    v-show="formValue['tagVisible-'+item.name+'.'+scope.$index+'.'+item1.jfieldName]"
                    v-model="formValue['tagValue-'+item.name+'.'+scope.$index+'.'+item1.jfieldName]"
                    :ref="'tag-'+item.name+'.'+scope.$index+'.'+item1.jfieldName"
                    @keyup.enter.native="handleInputConfirm(item.name+'.'+scope.$index+'.'+item1.jfieldName,scope.row[item1.jfieldName])"
                    @blur="handleInputConfirm(item.name+'.'+scope.$index+'.'+item1.jfieldName,scope.row[item1.jfieldName])"
                  >
                  </el-input>
                  <el-button v-show="!formValue['tagVisible-'+item.name+'.'+scope.$index+'.'+item1.jfieldName]" :class="scope.row[item1.jfieldName]&&scope.row[item1.jfieldName].length>0?'':'tagBoxBtn'" class="button-new-tag tagBox" size="small"  @click="showInput(item.name+'.'+scope.$index+'.'+item1.jfieldName)">+ New Tag</el-button>
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'icon_select'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择图标', trigger: ['blur','change'] }
                  ]"
                >
                  <icon-select
                    :ref="'icon-9'+item.prop"
                    v-model="scope.row[item1.jfieldName]"
                    placeholder="请选择图标"
                    @handlesetIconName="handlesetIconSub($event,scope.$index,item.name,item1)" />
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'color_select'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择颜色', trigger: ['blur','change'] }
                  ]"
                >
                  <el-color-picker
                    v-model="scope.row[item1.jfieldName]"
                    :predefine="predefineColors">
                  </el-color-picker>
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'select' || item1.editType == 'multi_select'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择'+item1.fieldDesc, trigger: 'change' }
                  ]">
                  <el-select
                    v-model="scope.row[item1.jfieldName]"
                    :multiple="item1.editType == 'select' ? false : true"
                    :clearable="true"
                    :placeholder="'请选择'+item1.fieldDesc"
                    :filterable="true"
                  >
                    <el-option
                      v-for="(item2,index2) in dictList[item1.dictListFun]"
                      :key="index2"
                      :label="item2.name"
                      :value="item2.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'time'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择时间', trigger: 'change' }
                  ]">
                  <el-time-picker
                    v-model="scope.row[item1.jfieldName]"
                    :is-range="item1.isRange"
                    :placeholder="'请选择'+item1.fieldDesc"
                    :start-placeholder="'请选择开始'+item1.fieldDesc"
								    :end-placeholder="'请选择结束'+item1.fieldDesc"
                    :editable="true"
                    :clearable="true"
                  />
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'date' || item1.editType == 'datetime'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择'+item1.fieldDesc, trigger: 'change' }
                  ]">
                  <el-date-picker
                    v-model="scope.row[item1.jfieldName]"
                    :type="item1.type"
                    :placeholder="'请选择'+item1.fieldDesc"
                    :start-placeholder="'请选择开始'+item1.fieldDesc"
								    :end-placeholder="'请选择结束'+item1.fieldDesc"
                    :editable="true"
                    :clearable="true"
                  />
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14"
                  v-if="item1.editType == 'radio'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择'+item1.fieldDesc, trigger: 'change' }
                  ]">
                  <el-radio-group v-model="scope.row[item1.jfieldName]"  >
                    <el-radio v-for="(item2,index2) in dictList[item1.dictListFun]" :key="index2" :label="item2.value">{{item2.name}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14"
                  v-if="item1.editType == 'checkbox'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择'+item1.fieldDesc, trigger: 'change' }
                  ]">
                  <el-checkbox-group v-model="scope.row[item1.jfieldName]" >
                    <el-checkbox  v-for="(item2,index2) in dictList[item1.dictListFun]" :key="index2" :label="item2.value">{{item2.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'switch'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择开关', trigger: 'change' }
                  ]">
                  <el-switch
                    v-model="scope.row[item1.jfieldName]"
                    active-color="#13ce66"
                    inactive-color="#C0CCDA"
                  >
                  </el-switch>
                </el-form-item>
                <el-form-item
                  class="treeFormTable"
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'tree_select'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请选择'+item1.fieldDesc, trigger: 'change' }
                  ]">
                  <tree-select
                    v-model="scope.row[item1.jfieldName]"
                    :clearable="true"
                    :multiple="false"
                    :options="item1.options"
                    :placeholder="'请选择'+item1.fieldDesc"
                    :disable-branch-nodes="false"
                    :searchable="true"
                    />
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'image'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请上传图片', trigger: 'change' }
                  ]">
                  <el-upload
                    action
                    class="upload-demo"
                    :ref="item.name+'-'+scope.$index+'-'+item1.jfieldName"
                    :file-list="scope.row[item1.jfieldName]"
                    :limit="item1.limit"
                    :on-exceed="(files,fileList)=>{handleExceedSub(files,fileList,scope.$index,item.name,item1)}"
                    :on-remove="(file,fileList)=>{handleOnRemoveSub(file,fileList,scope.$index,item.name,item1)}"
                    :on-change="(file,fileList)=>{handleOnChangeSub(file,fileList,scope.$index,item.name,item1)}"
                    :before-remove="beforeRemove"
                    accept=".jpeg,.gif,.png,.jpg"
                    :auto-upload="false"
                  >
                    <el-button slot="trigger" type="primary">上传图片</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="14px"
                  v-if="item1.editType == 'file'"
                  :prop="item.name+'.'+scope.$index+'.'+item1.jfieldName"
                  :rules="[
                    { required: true, message: '请上传文件', trigger: 'change' }
                  ]">
                  <el-upload
                    action
                    class="upload-demo"
                    :ref="item.name+'-'+scope.$index+'-'+item1.jfieldName"
                    :file-list="scope.row[item1.jfieldName]"
                    :limit="item1.limit"
                    :on-exceed="(files,fileList)=>{handleExceedSub(files,fileList,scope.$index,item.name,item1)}"
                    :on-remove="(file,fileList)=>{handleOnRemoveSub(file,fileList,scope.$index,item.name,item1)}"
                    :on-change="(file,fileList)=>{handleOnChangeSub(file,fileList,scope.$index,item.name,item1)}"
                    :before-remove="beforeRemove"
                    accept=".rar, .pdf, .PDF, .zip, .doc, .xls, .xlsx, .jpeg, .gif, .png, .jpg"
                    :auto-upload="false"
                  >
                    <el-button slot="trigger" type="primary">上传文件</el-button>
                  </el-upload>
                </el-form-item>
                <div v-if="!item1.editType">
                  <div v-if="item1.webFilter" class="rowMain">{{scope.row[item1.jfieldName] | item1.webFilter(item1.webFilterArr,item1.webFilterProp)}}</div>
                  <!-- <div v-else class="rowMain">sfasd和面试经历福建省老地方领导是减肥啦计算机按法律的世界反垄断是开发建设的开发建设的开发是放大镜谁代领弗利萨给付对价暗室逢灯康师傅收款登记反馈的实际付款时间的方式等法律会计师</div> -->
                  <div v-else class="rowMain">{{scope.row[item1.jfieldName]}}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 主子表 end -->
    </el-form>
    <!-- footer -->
    <div class="footer">
      <el-button type="primary"  @click="submitForm()">确定</el-button>
      <el-button @click="cancelForm()">取消</el-button>
    </div>
  </div>
</template>
<script>
import TreeSelect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import Tinymce from '@/components/Tinymce'
export default {
  name: "FormAssemblyName",
  components: {
    TreeSelect,
    IconSelect,
    Tinymce
  },
  props: {
    formData: {
      type: Object,
      require: true,
      default() {
        return {
          labelWidth: null,
          labelPosition: null,
          gutter: null,
          span: null,
          xs: null,
          sm: null,
          md: null,
          lg: null,
          xl: null,
          formList: {}
        };
      },
    },
    mainSubTable: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      formValue: {},
      initTableData:{},
      fileList: [],
      checkTableSum: {},
      activeName: this.mainSubTable.length > 0 ? this.mainSubTable[0].name : null,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    };
  },
  created() {
    this.initCheckVal();
    this.$nextTick(()=>{
      this.$refs['formAsse'].clearValidate();
    })

  },
  mounted(){

  },
  methods: {
    //暂时写这个方法，后期删除
    dictList(val){

    },
   //给表单中复选框的v-model值初始化
    initCheckVal(){
      this.formValue = {};
      this.initTableData = {};
      this.checkTableSum = {};
      this.formData.formList.forEach((item,index)=>{
        if(item.editType == 'checkbox' || item.editType == 'multi_select' || item.editType == 'tag_select'){
          this.$set(this.formValue, item.prop, []);
        }
        if(item.editType == 'icon_select' && this.$refs['icon-'+item.prop]!=undefined){
          this.$refs['icon-'+item.prop][0].clearFn()
        }
        if(item.editType == 'rate_score'){
          this.$set(this.formValue,item.prop,null)
        }
        //清除富文本编辑器内容
        if(item.editType == 'rich_text' && this.$refs['editor-'+item.prop]!=undefined){
          this.$refs['editor-'+item.prop][0].setContent("");
        }
      })
      //主子表中的v-model值初始化
      this.mainSubTable.forEach((item,index)=>{
        this.formValue[item.name] = [];
        this.initTableData[item.name] = {};
        this.checkTableSum[item.name] = [];
        item.insertList.forEach((item1,index1)=>{
          if(item1.editType == 'checkbox' || item1.editType == 'multi_select' || item1.editType == 'image' || item1.editType == 'file' || item1.editType == 'tag_select'){
            this.initTableData[item.name][item1.jfieldName] = [];
          }else{
            this.initTableData[item.name][item1.jfieldName] = null;
          }
        })
      })
      console.log(this.formValue)
    },
    //穿梭框
    renderFunc(h,option){
      return <span title={option.label}>{option.label}</span>;
    },
    //级联选择器改变值的时候
    handleChange(value){
      console.log(value)
    },
    //tag标签关闭的时候
    handleClose(tag,prop){
      this.formValue[prop].splice(this.formValue[prop].indexOf(tag),1);
    },
    //主子表中tag标签关闭的时候
    handleCloseTag(tag,name,index,name1){
      this.formValue[name][index][name1].splice(this.formValue[name][index][name1].indexOf(tag),1);
    },
    //tag标签中点击按钮框的时候
    showInput(prop){
      this.$set(this.formValue,"tagVisible-"+prop,true)
      this.$nextTick(_ => {
        this.$refs["tag-"+prop][0].$refs.input.focus();
      })
    },
    //tag标签keyup,blur
    handleInputConfirm(prop,val){
      let inputValue = this.formValue["tagValue-"+prop];
      if(inputValue){
        //判断是否有重复标签
        if(val.includes(inputValue)){
          this.$message({
            showClose: true,
            message: "已有名为【"+inputValue+"】的标签",
            type: 'warning'
          });
        }else{
          val.push(inputValue);
        }
      }
      this.$set(this.formValue,"tagVisible-"+prop,false)
      this.$set(this.formValue,"tagValue-"+prop,'')
    },
    //删除文件
    handleOnRemove(file, fileList,item){
      this.$set( this.formValue, item.prop, fileList)

    },
    //改变文件
    handleOnChange(file,fileList,item){
      if(file.status == 'ready'){
        const isLtM = file.size / 1024 / 1024 < 10;
        if (!isLtM) {
          fileList.pop()
          if(item.editType === 'file'){
            this.$message.error("文件大小不超过 10M")
          }
          if(item.editType === 'image'){
            this.$message.error("图片大小不超过 10M")
          }
          return false;
        } else {
          let num = 0,i=0;
          for( i=0;i<fileList.length;i++){
            if(fileList[i].name == file.name){
              num ++;
              if(num > 1){
                this.$message({
                  showClose: true,
                  message: item.editType=='image'?'已有名为“'+file.name+'”的图片，请选择其他图片':'已有名为“'+file.name+'”的文件，请选择其他文件',
                  type: 'warning'
                });
                fileList.pop()
                break;
              }
            }
          }
        this.$set( this.formValue, item.prop, fileList)
        }
      }
    },
    //移除文件时的提示
    beforeRemove(file, fileList){
      return this.$confirm(`确定移除 ${ file.name }吗？`);
    },
    //超出限制个数时的提示
    handleExceed(files, fileList,item) {
      this.$message.warning(item.editType=='image'?`当前限制选择 ${item.limit} 个图片，本次选择了 ${files.length} 个图片，共选择了 ${files.length + fileList.length} 个图片`:`当前限制选择 ${item.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //删除文件(主子表)
    handleOnRemoveSub(file, fileList,index,name,item1){
      this.$set( this.formValue[name][index], item1.jfieldName, fileList);

    },
    //改变文件(主子表)
    handleOnChangeSub(file,fileList,index,name,item1){
      if(file.status == 'ready'){
        const isLtM = file.size / 1024 / 1024 < 10;
        if (!isLtM) {
          if(item1.editType === 'file'){
            this.$message.error("文件大小不超过 10M")
          }
          if(item1.editType === 'image'){
            this.$message.error("图片大小不超过 10M")
          }
          fileList.pop()
          return false;
        } else{
            let num = 0,i=0;
            for( i=0;i<fileList.length;i++){
              if(fileList[i].name == file.name){
                num ++;
                if(num > 1){
                  this.$message({
                    showClose: true,
                    message: item1.editType=='image'?'已有名为“'+file.name+'”的图片，请选择其他图片':'已有名为“'+file.name+'”的文件，请选择其他文件',
                    type: 'warning'
                  });
                  fileList.pop()
                  break;
                }
              }
            }
            this.$set( this.formValue[name][index], item1.jfieldName, fileList);
        }
      }
    },
    //超出限制个数时的提示：主子表
    handleExceedSub(files, fileList,index,name,item1) {
      this.$message.warning(item1.editType=='image'?`当前限制选择 ${item1.limit} 个图片，本次选择了 ${files.length} 个图片，共选择了 ${files.length + fileList.length} 个图片`:`当前限制选择 ${item1.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },

    //点击tabs的选项卡
    handleClickTabs(){

    },
    //确定按钮
    submitForm(){
      console.log(this.formValue)
      this.$refs['formAsse'].validate((valid) => {
        if (valid) {
          console.log('submit')
          this.$emit('makeSure',this.formValue)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //取消按钮
    cancelForm(){
      // this.$refs['iconsel'][0].clearFn()
      this.initCheckVal();
      this.$nextTick(()=>{
        this.$refs['formAsse'].clearValidate();
      })
    },
    //图标选择器的绑定值
    handlesetIcon(val,prop){
      this.$set(this.formValue,prop,val)

    },
    //主子表中图标选择器的绑定值
    handlesetIconSub(val,index,name,item1){
      this.$set( this.formValue[name][index], item1.jfieldName, val);
    },
    //主子表中添加一行
    handAddNewRow(name){
      //加个时间戳为了防止数据一样导致复选框的选择出现不必要的bug
      const rows = JSON.parse(JSON.stringify(this.initTableData[name]))
      rows.timeNum = new Date().getTime()
      this.formValue[name].push(rows)
    },
    //主子表中批量删除
    handleDeleteBatchRow(name,int){
      if (this.checkTableSum[name].length == 0) {
        this.$message({
          showClose: true,
          message: '请选择删除行',
          type: 'warning'
				});
        return;
      }
      console.log(876)
      console.log(this.checkTableSum[name])
      this.$confirm("是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        for(let i = 0; i < this.formValue[name].length; i++){
          this.checkTableSum[name].forEach((item)=>{
            if(this.formValue[name][i].timeNum === item.timeNum){
              this.formValue[name].splice(i,1);
            }
          })
        }
        this.$refs['table-'+name][0].clearSelection()
        this.checkTableSum[name] = [];
      })
    },
    //table中当选择项发生变化时会触发该事件
    selectionChange(val,name) {
      this.checkTableSum[name] = val;
      console.log(this.checkTableSum[name])
    },

  },

};
</script>
<style lang="scss" scoped>
.formAsseBox {
  padding: 20px;
  .tagItem{
    margin-bottom: 8px;
    .el-form-item__error{
      padding-top: 5px;
    }
    // .el-input__inner{
    //     height: 30px !important;
    //     line-height: 30px !important;
    //   }
    .tagBox{
      margin-bottom: 10px;
      height: 30px;

    }
  }
  .tagBoxBtn{
    margin-left: 0;
  }
  .widthHundred{
    width: 100%;
  }
  .tabsBox{
    padding-bottom: 10px;
    padding-top: 10px;
    .el-form-item__content{
      margin-left: 0!important;
    }
    .tabBtn{
      margin-bottom: 10px;
    }
  }

  .footer{
    text-align: center;
    padding: 10px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>
<style >
.formAsseBox .formTransfer .el-transfer-panel__item.el-checkbox .el-checkbox__label{
  overflow: initial !important;
}
.formAsseBox .tagItem .el-form-item__error{
  margin-top: -10px;
}
.formAsseBox .tagItem .el-input--small .el-input__inner{
  height: 30px;
  line-height: 30px;
}
.treeFormTable .vue-treeselect div, .vue-treeselect span{
  line-height: 26px;
}
.treeForm .vue-treeselect__control{
  height: 28px;
}
.treeFormTable .vue-treeselect__control{
  height: 26px;
}
.tabsBox .el-table .cell{
  overflow: unset;
}
</style>

