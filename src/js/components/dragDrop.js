"use strict";

export const dragDrops = () => {
    const containers = document.querySelectorAll('.drag-drop');
    if (!containers.length) return;
    containers.forEach(container => {
        let dragSrcEl;

        function dragStart(e) {
            this.classList.add('_dragg');
            dragSrcEl = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        };

        function dragEnter(e) {
            this.classList.add('_over');
        }

        function dragLeave(e) {
            e.stopPropagation();
            this.classList.remove('_over');
        }

        function dragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        }

        function dragDrop(e) {
            if (dragSrcEl != this) {
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
                dragEnd();
                dragDropOder(container);
            }

            return false;
        }

        function dragEnd() {
            container.querySelectorAll('.drag-drop__item').forEach(item => {
                item.classList.remove('_over');
                item.classList.remove('_dragg');
            });
        }

        function dragDropOder(container) {
            if (container.classList.contains('drag-drop--order')) {
                container.querySelectorAll('.drag-drop__item').forEach((item, index) => {
                    const number = item.querySelector('[data-drag-drop-order-number]');
                    number.textContent = index + 1
                });
            }
        }

        function addEventsDragAndDrop(el) {
            el.addEventListener('dragstart', dragStart, false);
            el.addEventListener('dragenter', dragEnter, false);
            el.addEventListener('dragover', dragOver, false);
            el.addEventListener('dragleave', dragLeave, false);
            el.addEventListener('drop', dragDrop, false);
            el.addEventListener('dragend', dragEnd, false);
        }

        const listItems = container.querySelectorAll('.drag-drop__item');
        [].forEach.call(listItems, function (item) {
            addEventsDragAndDrop(item);
        });

    });
};

export const currentDragDrop = (container) => {
    let dragSrcEl;

    function dragStart(e) {
        this.classList.add('_dragg');
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    };

    function dragEnter(e) {
        this.classList.add('_over');
    }

    function dragLeave(e) {
        e.stopPropagation();
        this.classList.remove('_over');
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function dragDrop(e) {
        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
            dragEnd();
            dragDropOder(container);
        }

        return false;
    }

    function dragEnd() {
        container.querySelectorAll('.drag-drop__item').forEach(item => {
            item.classList.remove('_over');
            item.classList.remove('_dragg');
        });
    }

    function dragDropOder(container) {
        if (container.classList.contains('drag-drop--order')) {
            container.querySelectorAll('.drag-drop__item').forEach((item, index) => {
                const number = item.querySelector('[data-drag-drop-order-number]');
                number.textContent = index + 1
            });
        }
    }

    function addEventsDragAndDrop(el) {
        el.addEventListener('dragstart', dragStart, false);
        el.addEventListener('dragenter', dragEnter, false);
        el.addEventListener('dragover', dragOver, false);
        el.addEventListener('dragleave', dragLeave, false);
        el.addEventListener('drop', dragDrop, false);
        el.addEventListener('dragend', dragEnd, false);
    }
    if (container) {
        const listItems = container.querySelectorAll('.drag-drop__item');
        [].forEach.call(listItems, function (item) {
            addEventsDragAndDrop(item);
        });
    }
}
