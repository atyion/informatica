function fillTimetables(timetablesContainerId, timetableCourses, courses, schedules, channel) {
    const COLORS = ['red', 'yellow', 'green', 'blue', 'purple', 'orange', 'emerald', 'cyan', 'fuchsia', 'teal']

    let classesStartTime = undefined,
        classesEndTime = undefined;

    let schedule = {};

    for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
        schedule[day] = [];

    for (let course of timetableCourses) {
        let info = course.toString().split('-');
        let c = info[0];
        let ch = info[1] || channel;
        let d = schedules[c]['channels'][ch]

        for (const [day, info] of Object.entries(d)) {
            let times = info.hours.split('-')
            let startTime = parseInt(times[0])
            let endTime = parseInt(times[1])
            schedule[day].push({ code: c, startTime, endTime });
        }
    }


    for (const events of Object.values(schedule))
        for (const { startTime, endTime } of events) {
            classesStartTime = Math.min(classesStartTime, startTime) || startTime;
            classesEndTime = Math.max(classesEndTime, endTime) || endTime;
        }

    let subjectsColors = {}, nextColorIndex = 0;

    const desktopTbody = document.querySelector(`#${timetablesContainerId} .desktop tbody`);
    const mobileTbody = document.querySelector(`#${timetablesContainerId} .mobile tbody`);

    desktopTbody.innerHTML = '';
    mobileTbody.innerHTML = '';

    for (let time = classesStartTime; time < classesEndTime; time++) {
        const desktopTimeTd = document.createElement('td');
        desktopTimeTd.classList.add('font-light', 'italic');
        desktopTimeTd.innerHTML = `${time} - ${time + 1}`;

        const desktopTr = document.createElement('tr');
        desktopTr.append(desktopTimeTd);

        const mobileTimeTd = document.createElement('td');
        mobileTimeTd.classList.add('font-light', 'italic');
        mobileTimeTd.innerHTML = `${time} - ${time + 1}`;

        const mobileTr = document.createElement('tr');
        mobileTr.append(mobileTimeTd);

        for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']) {
            if (!schedule[day])
                continue;

            const desktopTd = document.createElement('td');
            const mobileTd = document.createElement('td');

            const cc = schedule[day]
                .filter(({ startTime, endTime }) => startTime <= time && endTime > time);

            let counter = 0;
            for (const { code } of cc) {
                desktopCourseLink = document.createElement('a');
                desktopCourseLink.href = `#${code}`
                desktopCourseLink.textContent =
                    courses[code] ?
                        (
                            courses[code].shortName ?
                                courses[code].shortName :
                                courses[code].name
                        )
                        :
                        code;

                mobileCourseLink = document.createElement('a');
                mobileCourseLink.href = `#${code}`
                mobileCourseLink.textContent =
                    courses[code] ?
                        (
                            courses[code].abbr ?
                                courses[code].abbr :
                                courses[code].name.substring(0, 2).toUpperCase()
                        )
                        :
                        code;



                if (!subjectsColors[code])
                    subjectsColors[code] = COLORS[nextColorIndex++ % COLORS.length];

                desktopCourseLink.classList.add(subjectsColors[code], 'font-bold');
                mobileCourseLink.classList.add(subjectsColors[code], 'font-bold');

                if (counter > 0) {
                    desktopTd.append(document.createElement('br'));
                    mobileTd.append(document.createElement('br'));
                }
                desktopTd.append(desktopCourseLink);
                mobileTd.append(mobileCourseLink);
                counter++;
            }


            desktopTr.append(desktopTd);
            mobileTr.append(mobileTd);
        }

        desktopTbody.append(desktopTr);
        mobileTbody.append(mobileTr);
    }
}