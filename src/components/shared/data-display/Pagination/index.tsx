const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

type PaginationProps = {
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  classNamePrefix?: 'pm' | 'tm' | 'sm' | 'cm' | 'om' | 'pcm' | 'fm' | 'csm'
}

const Pagination = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  classNamePrefix = 'pm',
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className={`${classNamePrefix}-pagination-shell`}>
      <div className={`${classNamePrefix}-pagination`}>
        <div className={`${classNamePrefix}-pagination-left`}>
          <div className={`${classNamePrefix}-page-info`}>
            共 {total} 条记录，当前第 {currentPage} / {totalPages} 页
          </div>
          <div className={`${classNamePrefix}-page-size`}>
            <span>每页显示</span>
            <select
              className={`${classNamePrefix}-page-size-btn`}
              value={pageSize}
              onChange={e => onPageSizeChange?.(Number(e.target.value))}
              style={{
                background: 'transparent',
                color: 'inherit',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size} 条
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${classNamePrefix}-page-controls`}>
          <button
            type="button"
            className={`${classNamePrefix}-page-arrow ${currentPage === 1 ? `${classNamePrefix}-disabled` : ''}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          <div className={`${classNamePrefix}-page-numbers`}>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button
                key={page}
                type="button"
                className={`${classNamePrefix}-page-num ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`${classNamePrefix}-page-arrow ${currentPage === totalPages ? `${classNamePrefix}-disabled` : ''}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
