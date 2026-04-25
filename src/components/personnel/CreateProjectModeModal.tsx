import { useEffect, useMemo, useState } from 'react'
import type { CreateProjectFormData, CreateProjectFormErrors } from './projectManagement.types'
import type { ProjectStatus } from '../../domain/projectStatusMachine'

type CreateProjectSubmitResult = {
  ok: boolean
  message: string
}

type CreateProjectModeModalProps = {
  isOpen: boolean
  submitting: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: (formData: CreateProjectFormData) => CreateProjectSubmitResult
}

const initialFormData: CreateProjectFormData = {
  projectName: '',
  storeName: '',
  storeType: '',
  city: '',
  region: '',
  projectType: '',
  projectStatus: '待立项',
  projectOwner: '',
  plannedStartDate: '',
  plannedEndDate: '',
  plannedOpenDate: '',
  specialRequirements: '',
}

const statusOptions: ProjectStatus[] = ['待立项', '待确认', '待拆解', '执行中']
const storeTypeOptions = ['标准店', '旗舰店', '改造店']
const projectTypeOptions = ['新建', '改造', '升级']

const CreateProjectModeModal = ({
  isOpen,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: CreateProjectModeModalProps) => {
  const [formData, setFormData] = useState<CreateProjectFormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<CreateProjectFormErrors>({})

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) {
        setFormData(initialFormData)
        setFormErrors({})
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, submitting])

  const canSubmit = useMemo(() => !submitting, [submitting])

  if (!isOpen) {
    return null
  }

  const resetFormState = () => {
    setFormData(initialFormData)
    setFormErrors({})
  }

  const handleClose = () => {
    if (submitting) {
      return
    }
    resetFormState()
    onClose()
  }

  const setField = <K extends keyof CreateProjectFormData>(
    key: K,
    value: CreateProjectFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    setFormErrors(prev => {
      if (!prev[key]) {
        return prev
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validate = (data: CreateProjectFormData): CreateProjectFormErrors => {
    const errors: CreateProjectFormErrors = {}

    if (!data.projectName.trim()) errors.projectName = '请输入项目名称'
    if (!data.storeName.trim()) errors.storeName = '请输入门店名称'
    if (!data.storeType.trim()) errors.storeType = '请选择门店类型'
    if (!data.city.trim()) errors.city = '请输入城市'
    if (!data.projectType.trim()) errors.projectType = '请选择项目类型'
    if (!data.projectOwner.trim()) errors.projectOwner = '请输入项目负责人'
    if (!data.plannedStartDate.trim()) errors.plannedStartDate = '请选择计划开始日期'
    if (!data.plannedEndDate.trim()) errors.plannedEndDate = '请选择计划结束日期'

    if (
      data.plannedStartDate &&
      data.plannedEndDate &&
      data.plannedEndDate < data.plannedStartDate
    ) {
      errors.plannedEndDate = '计划结束日期不能早于计划开始日期'
    }

    if (
      data.plannedOpenDate &&
      data.plannedStartDate &&
      data.plannedOpenDate < data.plannedStartDate
    ) {
      errors.plannedOpenDate = '计划开业日期不能早于计划开始日期'
    }

    return errors
  }

  const handleSubmit = () => {
    const errors = validate(formData)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const result = onSubmit(formData)
    if (result.ok) {
      handleClose()
    }
  }

  return (
    <div className="pm-create-modal-overlay" onClick={handleClose}>
      <div
        className="pm-create-modal pm-create-form-modal"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="新建项目"
      >
        <div className="pm-create-modal-header">
          <div>
            <h3>新建项目</h3>
            <p>填写最小必需信息，提交后将在项目列表中创建新项目。</p>
          </div>
          <button
            type="button"
            className="pm-create-modal-close"
            onClick={handleClose}
            disabled={submitting}
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <div className="pm-create-form-grid">
          <label className="pm-create-field">
            <span>项目名称 *</span>
            <input
              value={formData.projectName}
              onChange={event => setField('projectName', event.target.value)}
              placeholder="请输入项目名称"
            />
            {formErrors.projectName ? <em>{formErrors.projectName}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>门店名称 *</span>
            <input
              value={formData.storeName}
              onChange={event => setField('storeName', event.target.value)}
              placeholder="请输入门店名称"
            />
            {formErrors.storeName ? <em>{formErrors.storeName}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>门店类型 *</span>
            <select
              value={formData.storeType}
              onChange={event => setField('storeType', event.target.value)}
            >
              <option value="">请选择</option>
              {storeTypeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formErrors.storeType ? <em>{formErrors.storeType}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>项目类型 *</span>
            <select
              value={formData.projectType}
              onChange={event => setField('projectType', event.target.value)}
            >
              <option value="">请选择</option>
              {projectTypeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formErrors.projectType ? <em>{formErrors.projectType}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>城市 *</span>
            <input
              value={formData.city}
              onChange={event => setField('city', event.target.value)}
              placeholder="如：深圳"
            />
            {formErrors.city ? <em>{formErrors.city}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>区域</span>
            <input
              value={formData.region}
              onChange={event => setField('region', event.target.value)}
              placeholder="如：南山区"
            />
          </label>

          <label className="pm-create-field">
            <span>项目状态 *</span>
            <select
              value={formData.projectStatus}
              onChange={event => setField('projectStatus', event.target.value as ProjectStatus)}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="pm-create-field">
            <span>项目负责人 *</span>
            <input
              value={formData.projectOwner}
              onChange={event => setField('projectOwner', event.target.value)}
              placeholder="请输入负责人"
            />
            {formErrors.projectOwner ? <em>{formErrors.projectOwner}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>计划开始日期 *</span>
            <input
              type="date"
              value={formData.plannedStartDate}
              onChange={event => setField('plannedStartDate', event.target.value)}
            />
            {formErrors.plannedStartDate ? <em>{formErrors.plannedStartDate}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>计划结束日期 *</span>
            <input
              type="date"
              value={formData.plannedEndDate}
              onChange={event => setField('plannedEndDate', event.target.value)}
            />
            {formErrors.plannedEndDate ? <em>{formErrors.plannedEndDate}</em> : null}
          </label>

          <label className="pm-create-field">
            <span>计划开业日期</span>
            <input
              type="date"
              value={formData.plannedOpenDate}
              onChange={event => setField('plannedOpenDate', event.target.value)}
            />
            {formErrors.plannedOpenDate ? <em>{formErrors.plannedOpenDate}</em> : null}
          </label>

          <label className="pm-create-field pm-create-field-full">
            <span>特殊要求</span>
            <textarea
              value={formData.specialRequirements}
              onChange={event => setField('specialRequirements', event.target.value)}
              rows={3}
              placeholder="可填写重点注意事项（选填）"
            />
          </label>
        </div>

        {errorMessage ? <div className="pm-create-modal-error">{errorMessage}</div> : null}
        {submitting ? <div className="pm-create-inline-status">提交中，请稍候...</div> : null}

        <div className="pm-create-modal-footer">
          <button
            type="button"
            className="pm-btn-secondary"
            onClick={handleClose}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="button"
            className="pm-btn-primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateProjectModeModal
