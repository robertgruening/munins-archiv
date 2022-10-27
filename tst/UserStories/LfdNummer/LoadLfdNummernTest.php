<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../UserStories/LfdNummer/LoadLfdNummern.php");

final class LoadLfdNummernTest extends TestCase
{
    public function testLoadLfdNummern()
    {
        $loadLfdNummern = new LoadLfdNummern();

        $this->assertTrue($loadLfdNummern->run());
        $this->assertCount(127, $loadLfdNummern->getLfdNummern());
        $this->assertInstanceOf(LfdNummer::class, $loadLfdNummern->getLfdNummern()[0]);
    }
}