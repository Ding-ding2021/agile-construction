type PaginationProps = {
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  classNamePrefix?: 'pm' | 'tm' | 'sm' | 'cm' | 'om' | 'pcm' | 'fm' | 'csm'
}

const Pagination = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
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
            <button type="button" className={`${classNamePrefix}-page-size-btn`}>
              <span>{pageSize} 条</span>
            </button>
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
