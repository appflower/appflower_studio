<?php 
/**
 * Debug Pager class
 *
 */
class afStudioDebugPager {
	
	private $_resource;
	
	private $_current_page;
	
	private $_next_page;
	private $_previous_page;
	private $_first_page = 1;

	private $_last_page;	
	private $_total_pages;
	
	private $_limit;
	private $_offset;

	private $_total_found;
	
	private $_visible;
	
	
	public function __construct($total, $page = 1, $limit = 0) {
		$this->_current_page = $page;
		$this->_limit = ($limit == 0) ? sfConfig::get('app_per_page') : $limit;
		
		$this->_total_found = $total;
		$this->_total_pages = ceil($this->_total_found / $this->_limit);
		
		// Alias for last page
		$this->_last_page = $this->_total_pages;
	}
	
	public function isVisible() {
		if (empty($this->_visible)) {
			$this->_visible = ($this->_total_found > $this->_limit);
		}
		return $this->_visible;
	}
	
	public function getPackageNext($count = 2) {
		if (($this->_current_page + $count) >= $this->_total_pages ) {
			$count = $this->_total_pages - $this->_current_page;
		}
		$result = array();
		for ($i = $this->_current_page + 1; $i <= ($this->_current_page + $count); $i++) {
			$result[$i] = $i;
		}
		return $result;
	}
	
	public function getPackagePrevious($count = 2) {
		if (($this->_current_page - $count) <= 1 ) {
			$start = 1;
		} else {
			$start = $this->_current_page - $count;
		}
		
		$result = array();
		for ($i = $start; $i < $this->_current_page; $i++) {
			$result[$i] = $i;
		}
		return $result;
	}
	
	public function setPage($page) {
		$this->_current_page = $page;
	}
	
	public function getPage() {
		return $this->_current_page;
	}

	public function getLimit() {
		return $this->_limit;
	}
	
	public function getOffset() {
		return $this->_offset;
	}
	
	public function getLastPage() {
		return $this->_last_page;
	}
	
	public function getFirstPage() {
		return $this->_first_page;
	}
	
	public function getNext() {
		if (empty($this->_next_page)) {
			$this->_next_page = (($this->_current_page + 1) >= $this->_total_pages) ? $this->_total_pages : ($this->_current_page + 1);
		}
		return $this->_next_page;
	}
	
	public function getPrevious() {
		if (empty($this->_previous_page)) {
			$this->_previous_page = (($this->_current_page - 1) <= 1) ? 1 : ($this->_current_page - 1);
		}
		return $this->_previous_page;
	}
	
}

?>